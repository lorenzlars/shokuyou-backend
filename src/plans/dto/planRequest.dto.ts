import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNotEmpty, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { MealRequestDto } from './mealRequest.dto';

export class PlanRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    description: 'The plan meals',
    type: MealRequestDto,
    isArray: true,
  })
  @IsArray()
  @IsOptional()
  @Type(() => MealRequestDto)
  meals?: MealRequestDto[];
}
