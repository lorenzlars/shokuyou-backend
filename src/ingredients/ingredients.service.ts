import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, ILike, In, Repository } from 'typeorm';
import { PaginationSortOrder } from '../common/dto/paginationRequestFilterQuery.dto';
import { REQUEST } from '@nestjs/core';
import { IngredientEntity } from './ingredient.entity';

export type Ingredient = {
  name: string;
};

// TODO: Dublicate from recipe service, should be generic
type PaginationFilter = {
  page: number;
  pageSize: number;
  orderBy?: string;
  sortOrder?: PaginationSortOrder;
  filter?: string;
};

@Injectable()
export class IngredientsService {
  constructor(
    @InjectRepository(IngredientEntity)
    private readonly ingredientRepository: Repository<IngredientEntity>,

    // TODO: How to add the user into the type correctly
    @Inject(REQUEST) private readonly request: Request & { user: any },
  ) {}

  // TODO: Dublicate from recipe service, should be generic
  private createOrderQuery(filter: PaginationFilter) {
    const order: any = {};

    if (filter.orderBy) {
      order[filter.orderBy] = filter.sortOrder;

      return order;
    }

    order.name = PaginationSortOrder.DESC;

    return order;
  }

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

  async getIngredientPage(filter: PaginationFilter) {
    const [ingredients, total] = await this.ingredientRepository.findAndCount({
      order: this.createOrderQuery(filter),
      skip: (filter.page - 1) * filter.pageSize,
      take: filter.pageSize,
      where: {
        // TODO: Dublicate from recipe service, should be generic
        name: filter.filter ? ILike(`%${filter.filter}%`) : undefined, // TODO: Is filter sanitized?
        owner: { id: this.request.user.id },
      },
      relations: ['recipes', 'recipes.recipe'],
    });

    return {
      ...filter,
      content: ingredients.map((ingredient) => ({
        ...ingredient,
        recipes: ingredient.recipes?.map((recipeIngredient) => ({
          id: recipeIngredient?.recipe?.id,
          name: recipeIngredient?.recipe?.name,
        })),
      })), // TODO: Why is this needed by the transformer?
      total,
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
