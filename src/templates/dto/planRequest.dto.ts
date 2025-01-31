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

export class PlanRequestMealDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  dayIndex: number;

  // @ApiProperty()
  // @IsNumber()
  // @IsNotEmpty()
  // timeIndex: number;

  @ApiProperty()
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  recipeId: string;
}

export class PlanRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNumber()
  days: number;

  @ApiPropertyOptional({
    type: PlanRequestMealDto,
    isArray: true,
  })
  @IsArray()
  @IsOptional()
  @Type(() => PlanRequestMealDto)
  meals?: PlanRequestMealDto[];
}
