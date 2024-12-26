import { Module } from '@nestjs/common';
import { RecipesController } from './recipes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recipe } from './recipe.entity';
import { RecipesService } from './recipes.service';

@Module({
  imports: [TypeOrmModule.forFeature([Recipe])],
  providers: [RecipesService],
  controllers: [RecipesController],
})
export class RecipesModule {}
