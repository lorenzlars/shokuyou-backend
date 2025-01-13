import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsNotEmpty, IsDefined } from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { RecipeResponseDto } from '../../recipes/dto/recipeResponse.dto';

export class MealResponseDto {
  @ApiProperty()
  @IsString()
  @Expose()
  id: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Expose()
  dayIndex: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Expose()
  timeIndex: number;

  @ApiProperty({
    type: RecipeResponseDto,
  })
  @IsDefined()
  @Type(() => RecipeResponseDto)
  @Expose()
  recipe: RecipeResponseDto;
}
