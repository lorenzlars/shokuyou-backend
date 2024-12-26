import {
  Controller,
  Request,
  Post,
  UseGuards,
  Get,
  Body,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CreateUserDto } from '../users/dto/create-user.dto';

@ApiTags('auth')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private authService: AuthService) { }

  @UseGuards(LocalAuthGuard)
  @ApiOperation({
    description: 'Login the current user',
    operationId: 'login',
  })
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(LocalAuthGuard)
  @ApiOperation({
    description: 'Logout the current user',
    operationId: 'logout',
  })
  @Post('logout')
  async logout(@Request() req) {
    return req.logout();
  }

  @UseGuards(LocalAuthGuard)
  @ApiOperation({
    description: 'Register a new user',
    operationId: 'register',
  })
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    description: 'Get the current user',
    operationId: 'profile',
  })
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
