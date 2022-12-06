import { Body, Controller, Inject, Post } from '@nestjs/common';
import { CreateOneUserInputDTO } from './dtos/create-one-user-input.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @Post('create')
  async createOneUSer(
    @Body() userInput: CreateOneUserInputDTO,
  ): Promise<Partial<User> | undefined> {
    return this.userService.createOne(userInput);
  }
}
