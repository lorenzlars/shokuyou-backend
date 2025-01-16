import { Module } from '@nestjs/common';
import { ImportRecipesService } from './importRecipes.service';
import { DataController } from './data.controller';
import { RecipesModule } from '../recipes/recipes.module';
import { ImportRecipeService } from './importRecipe.service';

@Module({
  imports: [RecipesModule],
  providers: [ImportRecipesService, ImportRecipeService],
  controllers: [DataController],
})
export class DataModule {}
