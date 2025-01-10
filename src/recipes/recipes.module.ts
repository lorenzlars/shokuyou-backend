import { Module } from '@nestjs/common';
import { RecipesController } from './recipes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecipeEntity } from './recipe.entity';
import { RecipesService } from './recipes.service';
import { ConfigModule } from '@nestjs/config';
import { ImagesModule } from '../images/images.module';
import { IngredientsModule } from '../ingredients/ingredients.module';

@Module({
  imports: [
    ConfigModule,
    ImagesModule,
    IngredientsModule,
    TypeOrmModule.forFeature([RecipeEntity]),
  ],
  providers: [RecipesService],
  controllers: [RecipesController],
})
export class RecipesModule {}
