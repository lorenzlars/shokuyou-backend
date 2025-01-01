import { Module } from '@nestjs/common';
import { RecipesController } from './recipes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecipeEntity } from './recipe.entity';
import { RecipesService } from './recipes.service';
import { ConfigModule } from '@nestjs/config';
import { ImagesModule } from '../images/images.module';
import { ImageEntity } from '../images/image.entity';
import { RecipeMapper } from './recipe.mapper';

@Module({
  imports: [
    ConfigModule,
    ImagesModule,
    TypeOrmModule.forFeature([RecipeEntity, ImageEntity]),
  ],
  providers: [RecipesService, RecipeMapper],
  controllers: [RecipesController],
})
export class RecipesModule {}
