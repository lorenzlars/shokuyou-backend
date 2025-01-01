import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { Expose } from 'class-transformer';
export class RecipeResponseDto {
  @ApiProperty({
    description: 'The id of the recipe',
    example: '1',
  })
  @IsString()
  @Expose()
  id: string;

  @ApiProperty({
    description: 'Name of the recipe',
    example: 'Spaghetti Carbonara',
  })
  @IsString()
  @Expose()
  name: string;

  @ApiPropertyOptional({
    description: 'Description of the recipe',
    example: 'A classic Italian pasta dish',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Expose()
  description?: string;

  @ApiPropertyOptional({
    description: 'The image url the recipe image',
    required: false,
  })
  @IsString()
  @Expose()
  @IsOptional()
  imageUrl?: string;
}
