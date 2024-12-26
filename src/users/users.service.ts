import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findOne(username: string) {
    return this.userRepository.findOne({
      where: {
        username,
      },
    });
  }

  async create(createUserDto: CreateUserDto) {
    return this.userRepository.save(createUserDto);
  }
}
