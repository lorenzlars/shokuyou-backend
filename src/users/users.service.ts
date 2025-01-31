import { Injectable, NotFoundException } from '@nestjs/common';
import { AuthRequestDto } from '../auth/dto/authRequest.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async getById(id: string) {
    const user = await this.userModel.findOne({ id }).exec();

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  async getByUsername(username: string) {
    const user = await this.userModel.findOne({ username }).exec();

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  async create(authRequestDto: AuthRequestDto) {
    const user = new this.userModel(authRequestDto);
    return await user.save();
  }
}
