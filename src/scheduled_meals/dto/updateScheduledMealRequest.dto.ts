import { IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateScheduledMealRequestDto {
  @ApiProperty()
  @IsDateString()
  public datetime: string;
}
