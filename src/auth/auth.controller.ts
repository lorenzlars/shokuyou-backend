import { Controller, Post, UseGuards, Get, Body } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { User } from '../users/user.decorator';
import { UserResponseDto } from './dto/user-response.dto';

@ApiTags('auth')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private authService: AuthService) { }

  @ApiOperation({
    description: 'Login the current user',
    operationId: 'login',
  })
  @ApiOkResponse({
    description: 'Successfully logged in',
    type: LoginResponseDto,
  })
  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @ApiOperation({
    description: 'Register a new user',
    operationId: 'register',
  })
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    this.authService.register(createUserDto);

    return ApiCreatedResponse();
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    description: 'Get the current user',
    operationId: 'profile',
  })
  @ApiOkResponse({
    description: 'Successfully retrieved the current user',
    type: UserResponseDto,
  })
  @Get('profile')
  getProfile(@User() user) {
    return this.authService.getProfile(user.id);
  }
}
