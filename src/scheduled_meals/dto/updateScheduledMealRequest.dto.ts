import { IsISO8601 } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateScheduledMealRequestDto {
  @ApiProperty()
  @IsISO8601()
  public datetime: string;
}
