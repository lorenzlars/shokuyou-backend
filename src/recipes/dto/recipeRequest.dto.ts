import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';

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
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'The recipe source',
  })
  @IsString()
  @IsOptional()
  @IsUrl()
  source?: string;

  @ApiPropertyOptional({
    description: 'The number of servings',
  })
  @IsNumber()
  @IsOptional()
  servings?: number;

  @ApiPropertyOptional({
    description: 'The recipe duration in minutes',
  })
  @IsNumber()
  @IsOptional()
  duration?: number;

  @ApiPropertyOptional({
    description: 'The recipe ingredients',
  })
  @IsString()
  @IsOptional()
  ingredients?: string;

  @ApiPropertyOptional({
    description: 'The recipe instructions',
  })
  @IsString()
  @IsOptional()
  instructions?: string;

  @ApiPropertyOptional({
    description: 'The recipe nutrition',
  })
  @IsString()
  @IsOptional()
  nutrition?: string;

  @ApiPropertyOptional({
    description: 'The recipe notes',
  })
  @IsString()
  @IsOptional()
  notes?: string;
}
