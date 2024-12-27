import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRecipeDto {
  @ApiProperty({
    description: 'Name of the recipe',
    example: 'Spaghetti Carbonara',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Description of the recipe',
    example: 'A classic Italian pasta dish',
  })
  @IsString()
  description: string;
}
