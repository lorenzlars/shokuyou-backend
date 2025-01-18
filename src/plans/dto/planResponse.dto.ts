import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsNotEmpty,
  IsArray,
  IsNumber,
} from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { PlanResponseMealDto } from './planResponseMeal.dto';

export class PlanResponseDto {
  @ApiProperty()
  @IsString()
  @Expose()
  id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Expose()
  name: string;

  @ApiProperty()
  @IsNumber()
  @Expose()
  days: number;

  @ApiPropertyOptional({
    description: 'The plan meals',
    type: PlanResponseMealDto,
    isArray: true,
  })
  @IsString()
  @IsArray()
  @IsOptional()
  @Type(() => PlanResponseMealDto)
  @Expose()
  meals?: PlanResponseMealDto[];
}
