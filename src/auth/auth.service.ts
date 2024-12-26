import { ConflictException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { LoginResponseDto } from './dto/login-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string) {
    const user = await this.usersService.findOne(username);

    if (user && (await bcrypt.compare(pass, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;

      return result;
    }

    return null;
  }

  async login(loginUserDto: LoginUserDto): Promise<LoginResponseDto> {
    const user = await this.validateUser(
      loginUserDto.username,
      loginUserDto.password,
    );

    return {
      accessToken: this.jwtService.sign({
        username: user.username,
        sub: user.id,
      }),
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
    const { password, ...user } = await this.usersService.findOne(id);

    return user;
  }
}
