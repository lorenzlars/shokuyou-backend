import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Recipe } from './recipes.service';
import { RecipeResponseDto } from './dto/recipeResponse.dto';

@Injectable()
export class RecipeMapper {
  toResponseDto(recipe: Recipe): RecipeResponseDto {
    return plainToInstance(RecipeResponseDto, recipe, {
      excludeExtraneousValues: true,
    });
  }
}
