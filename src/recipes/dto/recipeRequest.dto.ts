import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class RecipeRequestDto {
  @ApiProperty({
    description: 'Name of the recipe',
    example: 'Spaghetti Carbonara',
  })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: 'Description of the recipe',
    example: 'A classic Italian pasta dish',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}
