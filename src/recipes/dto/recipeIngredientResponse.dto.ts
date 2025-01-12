import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class RecipeIngredientResponseDto {
  @ApiProperty()
  @IsString()
  @Expose()
  id: string;

  @ApiProperty()
  @IsString()
  @Expose()
  name: string;

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
