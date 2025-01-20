import { IsBoolean, IsISO8601, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ScheduledMealRequestDto {
  @ApiProperty()
  @IsString()
  public recipeId: string;

  @ApiProperty()
  @IsISO8601()
  public datetime: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  public done?: boolean;
}
