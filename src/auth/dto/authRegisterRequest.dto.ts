import { IsString, Matches, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthRegisterRequestDto {
  @ApiProperty({
    description: 'Username of the user',
    example: 'john_doe',
  })
  @IsString()
  username: string;

  @ApiProperty({
    description: 'Password of the user',
    example: 'P@ssw0rd123',
  })
  @IsString()
  @MinLength(8)
  @Matches(/(?=.*?[A-Z])/, {
    message: 'Password must include at least one uppercase letter',
  })
  @Matches(/(?=.*?[a-z])/, {
    message: 'Password must include at least one lowercase letter',
  })
  @Matches(/(?=.*?[0-9])/, {
    message: 'Password must include at least one number',
  })
  // Don't use: https://vue-i18n.intlify.dev/guide/essentials/syntax.html#special-characters
  @Matches(/(?=.*?[#?!$%^&*-])/, {
    message: 'Password must include at least one special character',
  })
  password: string;
}
