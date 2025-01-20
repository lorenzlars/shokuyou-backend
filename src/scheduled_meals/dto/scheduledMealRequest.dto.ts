import { IsISO8601, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ScheduledMealRequestDto {
  @ApiProperty()
  @IsString()
  public recipeId: string;

  @ApiProperty()
  @IsISO8601()
  public datetime: string;
}
