import { Module } from '@nestjs/common';
import { IngredientsController } from './ingredients.controller';
import { IngredientsService } from './ingredients.service';

import { MongooseModule } from '@nestjs/mongoose';
import { Ingredient, IngredientSchema } from './ingredient.schema';
import { RecipesModule } from '../recipes/recipes.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Ingredient.name, schema: IngredientSchema },
    ]),
    RecipesModule,
  ],
  controllers: [IngredientsController],
  providers: [IngredientsService],
  exports: [MongooseModule, IngredientsService],
})
export class IngredientsModule {}
