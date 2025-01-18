import { IsDateString, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ScheduledMealRequestDto {
  @ApiProperty()
  @IsString()
  public recipeId: string;

  @ApiProperty()
  @IsDateString()
  public datetime: string;
}
