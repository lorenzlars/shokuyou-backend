import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, ILike, In, Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { IngredientEntity } from './ingredient.entity';
import {
  paginatedFind,
  PaginationOptions,
} from '../common/pagination/paginatedFind';

export type Ingredient = {
  name: string;
};

@Injectable()
export class IngredientsService {
  constructor(
    @InjectRepository(IngredientEntity)
    private readonly ingredientRepository: Repository<IngredientEntity>,

    // TODO: How to add the user into the type correctly
    @Inject(REQUEST) private readonly request: Request & { user: any },
  ) {}

  async createIngredient(data: Ingredient, entityManager?: EntityManager) {
    const repo = entityManager
      ? entityManager.getRepository(IngredientEntity)
      : this.ingredientRepository;

    return repo.save({
      ...data,
      owner: { id: this.request.user.id },
    });
  }

  async createMissingIngredients(
    ingredients: Ingredient[],
    entityManager?: EntityManager,
  ) {
    const repo = entityManager
      ? entityManager.getRepository(IngredientEntity)
      : this.ingredientRepository;

    const existing = await repo.findBy({
      name: In(ingredients.map((ingredient) => ingredient.name)),
    });
    const existingNames = existing.map(
      (existingIngredient) => existingIngredient.name,
    );
    const toCreateIngredients = ingredients.filter(
      (ingredient) => !existingNames.includes(ingredient.name),
    );

    const created = await repo.save(
      toCreateIngredients.map((ingredient) => ({
        ...ingredient,
        owner: { id: this.request.user.id },
      })),
    );

    return [...existing, ...created];
  }

  async getIngredientPage(filter: PaginationOptions) {
    const { content: ingredients, ...rest } = await paginatedFind(
      this.ingredientRepository,
      {
        options: filter,
        where: {
          name: filter.filter ? ILike(`%${filter.filter}%`) : undefined, // TODO: Is filter sanitized?
          owner: { id: this.request.user.id },
        },
        relations: ['recipes', 'recipes.recipe'],
      },
    );

    return {
      ...rest,
      content: ingredients.map((ingredient) => ({
        ...ingredient,
        recipes: ingredient.recipes?.map((recipeIngredient) => ({
          id: recipeIngredient?.recipe?.id,
          name: recipeIngredient?.recipe?.name,
        })),
      })), // TODO: Why is this needed by the transformer?
    };
  }

  async getIngredient(id: string) {
    const ingredient = await this.ingredientRepository.findOne({
      where: {
        id,
        owner: { id: this.request.user.id },
      },
      relations: ['recipes', 'recipes.recipe'],
    });

    if (!ingredient) {
      throw new NotFoundException();
    }

    return {
      ...ingredient,
      recipes: ingredient.recipes?.map((recipeIngredient) => ({
        id: recipeIngredient?.recipe?.id,
        name: recipeIngredient?.recipe?.name,
      })),
    };
  }

  async updateIngredient(
    id: string,
    data: Partial<Ingredient>,
    entityManager?: EntityManager,
  ) {
    const repo = entityManager
      ? entityManager.getRepository(IngredientEntity)
      : this.ingredientRepository;

    const ingredient = await repo.findOne({
      where: { id },
    });

    if (!ingredient) {
      throw new NotFoundException();
    }

    const updatedIngredient = await repo.save({ ...ingredient, ...data });

    return {
      ...updatedIngredient,
      recipes: ingredient.recipes?.map((recipeIngredient) => ({
        id: recipeIngredient?.recipe?.id,
        name: recipeIngredient?.recipe?.name,
      })),
    };
  }

  async removeIngredient(id: string, entityManager?: EntityManager) {
    const repo = entityManager
      ? entityManager.getRepository(IngredientEntity)
      : this.ingredientRepository;

    const ingredient = await repo.findOne({
      where: { id },
      relations: {
        recipes: true,
      },
    });

    if (!ingredient) {
      throw new NotFoundException();
    }

    if (ingredient.recipes && ingredient.recipes.length > 0) {
      throw new ConflictException();
    }

    await repo.delete({ id });
  }
}
