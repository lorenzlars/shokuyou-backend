import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsObject, IsString } from 'class-validator';
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

  @ApiProperty({
    type: RecipeResponseFlatDto,
  })
  @IsObject()
  @Expose()
  public recipe: RecipeResponseFlatDto;
}
