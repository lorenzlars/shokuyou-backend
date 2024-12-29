import {
  Controller,
  Post,
  UseGuards,
  Get,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
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
import { User as UserEntity } from '../users/user.entity';
import { UserResponseDto } from './dto/user-response.dto';

@ApiTags('auth')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({
    summary: 'Login the current user',
    operationId: 'postLogin',
  })
  @ApiOkResponse({
    description: 'Successfully logged in',
    type: LoginResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    return await this.authService.login(loginUserDto);
  }

  @ApiOperation({
    summary: 'Register a new user',
    operationId: 'postRegister',
  })
  @ApiBody({
    description: 'Daten zur Erstellung eines neuen Benutzers',
    type: CreateUserDto,
  })
  @ApiCreatedResponse({
    description: 'User successfully registered',
  })
  @ApiConflictResponse({
    description: 'User already exists',
  })
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    await this.authService.register(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get the current user',
    operationId: 'getProfile',
  })
  @ApiOkResponse({
    description: 'Successfully retrieved the current user',
    type: UserResponseDto,
  })
  @Get('profile')
  async getProfile(@User() user: UserEntity) {
    await this.authService.getProfile(user.id);
  }
}
