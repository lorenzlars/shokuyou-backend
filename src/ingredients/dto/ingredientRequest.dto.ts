import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class IngredientRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;
}
