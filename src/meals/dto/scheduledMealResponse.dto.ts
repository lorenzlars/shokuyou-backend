import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { Expose } from 'class-transformer';
import { RecipeResponseDto } from '../../recipes/dto/recipeResponse.dto';

export class ScheduledMealResponseDto {
  @ApiProperty()
  @IsString()
  @Expose()
  public id: string;

  @ApiProperty()
  @IsDateString()
  @Expose()
  public datetime: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  @Expose()
  public done?: boolean;

  @ApiProperty({
    type: RecipeResponseDto,
  })
  @IsObject()
  @Expose()
  public recipe: RecipeResponseDto;
}
