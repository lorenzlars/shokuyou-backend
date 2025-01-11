import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { IngredientResponseDto } from '../../ingredients/dto/ingredientResponse.dto';
import { RecipeIngredientResponseDto } from './recipeIngredientResponse.dto';

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
    description: 'The recipe source',
  })
  @IsString()
  @IsOptional()
  @Expose()
  source?: string;

  @ApiPropertyOptional({
    description: 'The number of servings',
  })
  @IsNumber()
  @IsOptional()
  @Expose()
  servings?: number;

  @ApiPropertyOptional({
    description: 'The recipe duration in minutes',
  })
  @IsNumber()
  @IsOptional()
  @Expose()
  duration?: number;

  @ApiPropertyOptional({
    description: 'The recipe ingredients',
    isArray: true,
    type: RecipeIngredientResponseDto,
  })
  @Type(() => RecipeIngredientResponseDto)
  @IsArray()
  @IsOptional()
  @Expose()
  ingredients?: RecipeIngredientResponseDto[];

  @ApiPropertyOptional({
    description: 'The recipe instructions',
  })
  @IsString()
  @IsOptional()
  @Expose()
  instructions?: string;

  @ApiPropertyOptional({
    description: 'The recipe nutrition',
  })
  @IsString()
  @IsOptional()
  @Expose()
  nutrition?: string;

  @ApiPropertyOptional({
    description: 'The recipe notes',
  })
  @IsString()
  @IsOptional()
  @Expose()
  notes?: string;

  @ApiPropertyOptional({
    description: 'The image url the recipe image',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Expose()
  imageUrl?: string;
}
