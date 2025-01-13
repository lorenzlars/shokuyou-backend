import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNotEmpty, IsArray } from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { MealResponseDto } from './mealResponse.dto';

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

  @ApiPropertyOptional({
    description: 'The plan meals',
    type: MealResponseDto,
    isArray: true,
  })
  @IsString()
  @IsArray()
  @IsOptional()
  @Type(() => MealResponseDto)
  @Expose()
  meals?: MealResponseDto[];
}
