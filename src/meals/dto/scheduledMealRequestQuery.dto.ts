import { IsISO8601 } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ScheduledMealRequestQueryDto {
  @ApiProperty()
  @IsISO8601()
  public from: string;

  @ApiProperty()
  @IsISO8601()
  public to: string;
}
