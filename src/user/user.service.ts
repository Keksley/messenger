import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './user.entity';
import { sign } from 'jsonwebtoken';
import { UserResponseInterface } from './types/user-response.interface';
import { JWT_SECRET } from 'src/config';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const emptyUser = new UserEntity();
    const user: UserEntity = {
      ...emptyUser,
      ...createUserDto,
      hash: emptyUser.hash,
    };

    return await this.userRepository.save<UserEntity>(user);
  }

  buildUserResponse(user: UserEntity): UserResponseInterface {
    const token = sign(
      {
        username: user.username,
        id: user.id,
        email: user.email,
      },
      JWT_SECRET,
    );
    return {
      ...user,
      token,
    };
  }
}