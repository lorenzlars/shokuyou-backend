import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { IngredientEntity } from './ingredient.entity';
import { PaginationSortOrder } from '../common/dto/paginationRequestFilterQueryDto';
import { REQUEST } from '@nestjs/core';

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

  async create(data: Partial<IngredientEntity>): Promise<IngredientEntity> {
    const ingredient = this.ingredientRepository.create({
      ...data,
      owner: { id: this.request.user.id },
    });

    return this.ingredientRepository.save(ingredient);
  }

  async getPage(filter: PaginationFilter) {
    const [ingredients, total] = await this.ingredientRepository.findAndCount({
      order: this.createOrderQuery(filter),
      skip: (filter.page - 1) * filter.pageSize,
      take: filter.pageSize,
      where: {
        // TODO: Dublicate from recipe service, should be generic
        name: filter.filter ? ILike(`%${filter.filter}%`) : undefined, // TODO: Is filter sanitized?
        owner: { id: this.request.user.id },
      },
    });

    return {
      ...filter,
      content: ingredients.map((ingredient) => ({ ...ingredient })), // TODO: Why is this needed by the transformer?
      total,
    };
  }

  async findAll(): Promise<IngredientEntity[]> {
    return this.ingredientRepository.find({
      relations: ['recipes', 'owner'], // Load related entities if necessary
    });
  }

  async findOne(id: string): Promise<IngredientEntity> {
    const ingredient = await this.ingredientRepository.findOne({
      where: { id },
      relations: ['recipes', 'owner'], // Load related entities if necessary
    });

    if (!ingredient) {
      throw new NotFoundException(`Ingredient with ID "${id}" not found`);
    }

    return ingredient;
  }

  async update(
    id: string,
    data: Partial<IngredientEntity>,
  ): Promise<IngredientEntity> {
    const ingredient = await this.findOne(id); // Ensure ingredient exists

    Object.assign(ingredient, data);
    return this.ingredientRepository.save(ingredient);
  }

  // Delete an ingredient by ID
  async delete(id: string): Promise<void> {
    const ingredient = await this.findOne(id); // Ensure ingredient exists

    await this.ingredientRepository.remove(ingredient);
  }
}
