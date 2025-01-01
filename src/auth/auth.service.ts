import { ConflictException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthResponseDto } from './dto/authResponse.dto';
import { RequestUser } from '../users/user.decorator';
import { AuthRequestDto } from './dto/authRequest.dto';

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

  async login(user: RequestUser): Promise<AuthResponseDto> {
    const payload = { username: user.username, sub: user.id };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async register(authRequestDto: AuthRequestDto) {
    if (await this.usersService.findOne(authRequestDto.username)) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(authRequestDto.password, 10);

    return await this.usersService.create({
      ...authRequestDto,
      password: hashedPassword,
    });
  }

  async getProfile(id: string) {
    return await this.usersService.findOne(id);
  }
}
