import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './user.entity';
import { sign } from 'jsonwebtoken';
import { UserResponseInterface } from './types/user-response.interface';
import { JWT_SECRET } from 'src/config';
import { LoginDto } from './dto/login.dto';
import { compare } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const userByEmail = await this.userRepository.findOne({
      email: createUserDto.email,
    });
    const userByUsername = await this.userRepository.findOne({
      username: createUserDto.username,
    });
    if (userByUsername || userByEmail) {
      throw new HttpException(
        'Email or username are taken',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const newUser = new UserEntity();
    Object.assign(newUser, createUserDto);

    return await this.userRepository.save<UserEntity>(newUser);
  }

  async login(loginDto: LoginDto): Promise<UserEntity> {
    const user = await this.userRepository.findOne(
      {
        email: loginDto.email,
      },
      { select: ['id', 'bio', 'username', 'password', 'image', 'email'] },
    );
    console.log(user);
    if (!user) {
      throw new HttpException(
        'Credentials are not valid',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const isPasswordCorrect: boolean = await compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordCorrect) {
      throw new HttpException(
        'Credentials are not valid',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    return user;
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

    delete user.password;

    return {
      ...user,
      token,
    };
  }
}
