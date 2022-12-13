import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PinoLogger } from 'nestjs-pino';
import { FindManyOptions, FindOptionsSelect, Repository } from 'typeorm';
import { CreateOneUserInputDTO } from './dtos/create-one-user-input.dto';
import { User } from './entities/user.entity';
import { UserStatus } from '../common/catalogs/user-status.enum';
import { UserRoles } from 'src/common/catalogs/user-role.enum';
import { findAllUSersResponse } from './dtos/find-all-users-response.dto';
import { FindOneUserResponse } from './dtos/find-one-user-response.dto';
import { FindAllUsersInput } from './dtos/find-all-users-input.dto';
import { equals } from 'class-validator';
import { notEqual } from 'assert';
import { isNull } from 'util';

const userColumns: any = [
  'id',
  'username',
  'email',
  'role',
  'status',
  'createdBy',
  'updatedBy',
  'deletedBy',
  'createdAt',
  'updatedAt',
  'deletedAt',
];
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly logger: PinoLogger,
  ) {}

  async findOne(username: string): Promise<User | undefined> {
    return await this.userRepository.findOne({
      where: { username },
      select: userColumns,
    });
  }

  async findAll(
    input: FindAllUsersInput,
  ): Promise<findAllUSersResponse | undefined> {
    const { filtering, paging, sorting } = input;

    const a = (item, op) => {
      const b = {};
      filtering &&
        Object.entries(item).forEach((field) => {
          switch (field[0]) {
            case 'status':
              if (`${field[1]}` in UserStatus) {
                b[field[0]] = UserStatus[`${field[1]}`.toUpperCase()];
              }
              break;
            case 'role':
              if (`${field[1]}` in UserRoles) {
                b[field[0]] = UserRoles[`${field[1]}`.toUpperCase()];
              }
              break;
            case 'createdAt':
            case 'updatedAt':
            case 'deletedAt':
              b[field[0]] = new Date(`${field[1]}`);
              break;
            default:
              b[field[0]] = {
                [op]: field[1],
              };
          }
        });
      return b;
    };

    const findInput: FindManyOptions<User> = {
      where: { ...a(filtering, 'equals'), deletedAt: null },
      ...paging,
      order: sorting,
    };

    console.log(findInput);

    const result = await this.userRepository.find(findInput);

    return result;
  }

  async createOne(userInput: CreateOneUserInputDTO): Promise<User | undefined> {
    this.logger.debug({
      event: 'user.createOne.input',
      data: { userInput },
    });

    const user: User = await this.userRepository.findOne({
      where: [{ username: userInput.username }, { email: userInput.email }],
    });

    if (user) {
      this.logger.info({
        event: 'user.createOne.fail',
        data: { message: 'Username or email is already taken.' },
      });
      throw new HttpException(
        'Username or email is already taken.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const auditStats = {
      createdAt: new Date(),
      updatedAt: null,
      deletedAt: null,
      createdBy: `${userInput.email}`,
      updatedBy: null,
      deletedBy: null,
    };

    const inserts = {
      status: userInput?.status || UserStatus.REGISTERED,
      role: userInput?.role || UserRoles.BASIC,
    };

    const finalNewUserData = { ...userInput, ...auditStats, ...inserts };

    try {
      const newUser = this.userRepository.create(finalNewUserData);
      this.logger.info({
        event: 'user.createOne.success',
        data: { newUser },
      });
      return await this.userRepository.save(newUser);
    } catch (error) {
      this.logger.error({
        event: 'user.createOne.fail',
        data: { exception: `${error}` },
      });
    }
  }

  async deleteOneUserHard(userId: number): Promise<string> {
    this.logger.debug({
      event: 'user.deleteOneHard.input',
      data: { userId },
    });
    try {
      const userExists = await this.userRepository.findOne({
        where: { id: userId },
      });

      if (!userExists) {
        this.logger.error({
          event: 'user.deleteOneHard.fail',
          data: { exception: `User with id:${userId} doesnt exists.` },
        });
        throw new HttpException('UserNotFound', HttpStatus.BAD_REQUEST);
      }

      await this.userRepository.delete({ id: userId });

      return `User with id:${userId} was deleted.`;
    } catch (error) {
      this.logger.error({
        event: 'user.deleteOneHard.fail',
        data: { exception: `${error}` },
      });
    }
  }
}
