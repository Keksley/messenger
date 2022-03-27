import {
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { UserResponseInterface } from './types/user-response.interface';
import { UserService } from './user.service';
import { User } from './decorators/user.decorator';
import { UserEntity } from './user.entity';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('users')
  @UsePipes(new ValidationPipe())
  async createUser(
    @Body('user') createUserDto: CreateUserDto,
  ): Promise<UserResponseInterface> {
    const user = await this.userService.createUser(createUserDto);
    return this.userService.buildUserResponse(user);
  }

  @Post('users/login')
  @UsePipes(new ValidationPipe())
  async login(
    @Body('user') createUserDto: LoginDto,
  ): Promise<UserResponseInterface> {
    const user = await this.userService.login(createUserDto);
    return this.userService.buildUserResponse(user);
  }

  @Get('user')
  currentUser(
    @User()
    user: UserEntity,
  ): Promise<UserResponseInterface> | any {
    return this.userService.buildUserResponse(user);
  }
}
