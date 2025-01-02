import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class AuthResponseDto {
  @ApiProperty({ description: 'Access token for the user to authenticate' })
  @IsString()
  @Expose()
  accessToken: string;
}
