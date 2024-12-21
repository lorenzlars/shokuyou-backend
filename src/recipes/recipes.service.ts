import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recipe } from './recipe.entity'
import { CreateRecipeDto } from './dto/CreateRecipeDto'
import { UpdateRecipeDto } from './dto/UpdateRecipeDto'

@Injectable()
export class RecipesService {
  private readonly logger = new Logger(RecipesService.name);

  constructor(
    @InjectRepository(Recipe)
    private recipeRepository: Repository<Recipe>,
  ) {}

  async findAll() {
    return this.recipeRepository.find();
  }

  findOne(id: string) {
    return this.recipeRepository.findOne({
      where: { id },
    });
  }

  async addRecipe(createRecipeDto: CreateRecipeDto) {
    return this.recipeRepository.save(createRecipeDto);
  }

  async updateRecipe(id: string, updateRecipeDto: UpdateRecipeDto) {
    const recipe = await this.findOne(id);

    if (!recipe) {
      throw new NotFoundException();
    }

    return this.recipeRepository.save(updateRecipeDto);
  }

  async removeRecipe(id: string): Promise<void> {
    await this.recipeRepository.delete(id);
  }
}