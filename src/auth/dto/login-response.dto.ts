import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({ description: 'Access token for the user to authenticate' })
  @IsString()
  accessToken: string;
}
