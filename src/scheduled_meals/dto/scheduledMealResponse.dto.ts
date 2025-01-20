import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { Expose } from 'class-transformer';
import { RecipeResponseFlatDto } from '../../recipes/dto/recipeResponseFlat.dto';

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
    type: RecipeResponseFlatDto,
  })
  @IsObject()
  @Expose()
  public recipe: RecipeResponseFlatDto;
}
