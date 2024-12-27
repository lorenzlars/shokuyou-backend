import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRecipeDto {
  @ApiProperty({
    description: 'The name of the recipe',
    example: 'Spaghetti Carbonara',
  })
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'The description of the recipe',
    example: 'A classic Italian pasta dish',
  })
  @IsString()
  description?: string;
}
