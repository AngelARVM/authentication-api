import {
  ConflictException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PinoLogger } from 'nestjs-pino';
import { throwError } from 'rxjs';
import { Repository } from 'typeorm';
import { CreateOneUserInputDTO } from './dtos/create-one-user-input.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly logger: PinoLogger,
  ) {}

  async findOne(username: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { username } });
  }

  async createOne(userInput: CreateOneUserInputDTO): Promise<User | undefined> {
    this.logger.debug({
      event: 'user.createOne.input',
      data: { userInput },
    });

    const user: User = await this.userRepository.findOne({
      where: [{ username: userInput.username }, { email: userInput.email }],
    });

    if (!!user) {
      this.logger.info({
        event: 'user.createOne.fail',
        data: { message: 'Username or email is already taken.' },
      });
      throw new HttpException(
        'Username or email is already taken.',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const newUser = this.userRepository.create(userInput);
      this.logger.info({
        event: 'user.createOne.success',
        data: { newUser },
      });
      return this.userRepository.save(newUser);
    } catch (error) {
      this.logger.error({
        event: 'user.createOne.fail',
        data: { exception: `${error}` },
      });
    }
  }
}
