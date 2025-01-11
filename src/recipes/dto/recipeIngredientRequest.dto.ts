import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class RecipeIngredientRequestDto {
  @ApiProperty()
  @IsString()
  @Expose()
  ingredientId: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @Expose()
  unit: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @Expose()
  amount: number;
}
