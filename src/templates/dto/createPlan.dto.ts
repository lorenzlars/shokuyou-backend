import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsNotEmpty,
  IsArray,
  IsNumber,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePlanMealDto {
  @ApiProperty()
  @IsNumber()
  dayIndex: number;

  @ApiProperty()
  @IsString()
  @IsUUID()
  recipeId: string;
}

export class CreatePlanDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNumber()
  days: number;

  @ApiPropertyOptional({
    type: CreatePlanMealDto,
    isArray: true,
  })
  @IsArray()
  @IsOptional()
  @Type(() => CreatePlanMealDto)
  meals?: CreatePlanMealDto[];
}
