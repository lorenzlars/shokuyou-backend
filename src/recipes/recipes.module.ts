import { Module } from '@nestjs/common';
import { RecipesController } from './recipes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecipesService } from './recipes.service';
import { ConfigModule } from '@nestjs/config';
import { ImagesModule } from '../images/images.module';
import { IngredientsModule } from '../ingredients/ingredients.module';
import { RecipeEntity } from './entities/recipe.entity';
import { RecipeIngredientEntity } from './entities/recipeIngredient.entity';
import { UsersModule } from '../users/users.module';
import { ImportRecipesService } from '../data/importRecipes.service';

@Module({
  imports: [
    UsersModule,
    ConfigModule,
    ImagesModule,
    IngredientsModule,
    TypeOrmModule.forFeature([RecipeEntity, RecipeIngredientEntity]),
  ],
  providers: [RecipesService, ImportRecipesService],
  controllers: [RecipesController],
  exports: [TypeOrmModule, RecipesService],
})
export class RecipesModule {}
