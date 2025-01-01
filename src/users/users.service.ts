import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { AuthRequestDto } from '../auth/dto/authRequest.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async findOne(username: string) {
    const user = this.userRepository.findOne({
      where: {
        username,
      },
    });

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  async create(authRequestDto: AuthRequestDto) {
    return this.userRepository.save(authRequestDto);
  }
}
