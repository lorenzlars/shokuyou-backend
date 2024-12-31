import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recipe } from './recipe.entity';
import {
  PaginationFilterDto,
  SortOrder,
} from '../common/dto/pagination-filter.dto';
import { ResponseRecipeDto } from './dto/response-recipe.dto';

@Injectable()
export class RecipesService {
  private readonly logger = new Logger(RecipesService.name);

  constructor(
    @InjectRepository(Recipe)
    private recipeRepository: Repository<Recipe>,
  ) {}

  private createOrderQuery(filter: PaginationFilterDto) {
    const order: any = {};

    if (filter.orderBy) {
      order[filter.orderBy] = filter.sortOrder;

      return order;
    }

    order.name = SortOrder.DESC;

    return order;
  }

  async findAll(filter: PaginationFilterDto): Promise<[Recipe[], number]> {
    const [recipes, count] = await this.recipeRepository.findAndCount({
      order: this.createOrderQuery(filter),
      skip: (filter.page - 1) * filter.pageSize,
      take: filter.pageSize,
      relations: ['image'],
    });

    const mappedRecipes = recipes.map(({ image, ...recipe }) => ({
      ...recipe,
      imageUrl: image?.url,
    }));

    return [mappedRecipes, count];
  }

  async findOne(id: string) {
    const recipe = await this.recipeRepository.findOne({
      where: { id },
      relations: ['image'],
    });

    if (!recipe) {
      throw new NotFoundException();
    }

    return recipe;
  }

  async addRecipe(recipe: Omit<Recipe, 'id'>) {
    return this.recipeRepository.save(recipe);
  }

  async updateRecipe(id: string, recipe: Omit<Recipe, 'id'>) {
    const currentRecipe = await this.findOne(id);

    if (!currentRecipe) {
      throw new NotFoundException();
    }

    return await this.recipeRepository.save({
      ...currentRecipe,
      ...recipe,
    });
  }

  async removeRecipe(id: string) {
    const result = await this.recipeRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException();
    }
  }
}
