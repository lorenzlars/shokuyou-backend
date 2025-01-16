import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUrl } from 'class-validator';

export class ImportRecipeDto {
  @ApiProperty()
  @IsString()
  @IsUrl({
    require_protocol: true,
    require_valid_protocol: true,
    protocols: ['http', 'https'],
  })
  url: string;
}
