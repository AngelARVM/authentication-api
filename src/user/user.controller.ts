import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CreateOneUserInputDTO } from './dtos/create-one-user-input.dto';
import { findAllUSersResponse } from './dtos/find-all-users-response.dto';
import { FindOneUserResponse } from './dtos/find-one-user-response.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get('')
  async findAll(): Promise<findAllUSersResponse> {
    return this.userService.findAll();
  }

  @Get('/:username')
  async findOne(
    @Param('username') username: string,
  ): Promise<FindOneUserResponse | undefined> {
    return this.userService.findOne(username);
  }

  @Post('create')
  async createOneUSer(
    @Body() userInput: CreateOneUserInputDTO,
  ): Promise<Partial<User> | undefined> {
    return await this.userService.createOne(userInput);
  }

  @Delete('deleteOneHard/:id')
  deleteOneHard(@Param('userId') userId: string): Promise<string | undefined> {
    return this.userService.deleteOneUserHard(Number(userId));
  }
}
