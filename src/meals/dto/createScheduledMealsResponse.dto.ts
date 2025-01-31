import { IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ScheduledMealResponseDto } from './scheduledMealResponse.dto';

export class CreateScheduledMealsResponseDto {
  @ApiProperty({
    isArray: true,
    type: ScheduledMealResponseDto,
  })
  @IsArray()
  @Type(() => ScheduledMealResponseDto)
  @Expose()
  public meals: ScheduledMealResponseDto[];
}
