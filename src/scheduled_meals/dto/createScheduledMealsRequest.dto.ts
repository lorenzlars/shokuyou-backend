import { IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ScheduledMealRequestDto } from './scheduledMealRequest.dto';
import { Type } from 'class-transformer';

export class CreateScheduledMealsRequestDto {
  @ApiProperty({
    type: ScheduledMealRequestDto,
    isArray: true,
  })
  @IsArray()
  @Type(() => ScheduledMealRequestDto)
  public meals: ScheduledMealRequestDto[];
}
