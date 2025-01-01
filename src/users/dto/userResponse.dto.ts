import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class UserResponseDto {
  @ApiProperty({
    description: 'The id of the user',
  })
  @IsString()
  @Expose()
  id: string;

  @ApiProperty({
    description: 'Username of the user',
    example: 'john_doe',
  })
  @IsString()
  @Expose()
  username: string;
}
