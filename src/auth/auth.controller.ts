import {
  Controller,
  Post,
  UseGuards,
  Body,
  HttpCode,
  HttpStatus,
  Get,
} from '@nestjs/common';
import {
  ApiBasicAuth,
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
import { AuthResponseDto } from './dto/authResponse.dto';
import { RequestUser, User } from '../users/user.decorator';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthRequestDto } from './dto/authRequest.dto';
import { UserResponseDto } from '../users/dto/userResponse.dto';
import { TransformResponse } from '../common/interceptors/responseTransformInterceptor';
import { AuthRegisterRequestDto } from './dto/authRegisterRequest.dto';

@ApiTags('auth')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @ApiBasicAuth()
  @ApiOperation({
    summary: 'Login the current user',
    operationId: 'userLogin',
  })
  @ApiBody({
    type: AuthRequestDto,
  })
  @ApiOkResponse({
    description: 'Successfully logged in',
    type: AuthResponseDto,
  })
  @TransformResponse(AuthResponseDto)
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@User() user: RequestUser): Promise<AuthResponseDto> {
    return await this.authService.login(user);
  }

  @ApiOperation({
    summary: 'Register a new user',
    operationId: 'userRegister',
  })
  @ApiBody({
    description: 'Daten zur Erstellung eines neuen Benutzers',
    type: AuthRegisterRequestDto,
  })
  @ApiCreatedResponse({
    description: 'User successfully registered',
  })
  @ApiConflictResponse({
    description: 'User already exists',
  })
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  async register(@Body() authRegisterRequestDto: AuthRegisterRequestDto) {
    await this.authService.register(authRegisterRequestDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Get the current user',
    operationId: 'getProfile',
  })
  @ApiOkResponse({
    description: 'Successfully retrieved the current user',
    type: UserResponseDto,
  })
  @TransformResponse(UserResponseDto)
  @Get('profile')
  async getProfile(@User() user: RequestUser): Promise<UserResponseDto> {
    return await this.authService.getProfile(user.id);
  }
}
