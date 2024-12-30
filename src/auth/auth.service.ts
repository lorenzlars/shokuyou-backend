import { ConflictException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { User } from 'src/users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.usersService.findOne(username);

    if (user && (await bcrypt.compare(password, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;

      return result;
    }

    return null;
  }

  async login(user: User): Promise<LoginResponseDto> {
    const payload = { username: user.username, sub: user.id };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async register(createUserDto: CreateUserDto) {
    if (await this.usersService.findOne(createUserDto.username)) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    return await this.usersService.create({
      ...createUserDto,
      password: hashedPassword,
    });
  }

  async getProfile(id: string) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...user } = await this.usersService.findOne(id);

    return user;
  }
}
