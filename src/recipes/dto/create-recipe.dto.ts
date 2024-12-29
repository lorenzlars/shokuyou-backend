import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Optional } from '@nestjs/common';

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
    required: false,
  })
  @IsString()
  description?: string;
}
