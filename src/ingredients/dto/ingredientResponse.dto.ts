import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';
import { Expose, Type } from 'class-transformer';

export class IngredientRequestRecipeDto {
  @ApiProperty()
  @IsString()
  @Expose()
  id: string;

  @ApiProperty()
  @IsString()
  @Expose()
  name: string;
}

export class IngredientResponseDto {
  @ApiProperty()
  @IsString()
  @Expose()
  id: string;

  @ApiProperty()
  @IsString()
  @Expose()
  name: string;

  @ApiPropertyOptional({
    type: IngredientRequestRecipeDto,
    isArray: true,
  })
  @IsArray()
  @IsOptional()
  @Type(() => IngredientRequestRecipeDto)
  @Expose()
  recipes?: IngredientRequestRecipeDto[];
}
