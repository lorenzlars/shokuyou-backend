import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ProductRequestDto } from './dto/productRequest.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { ProductEntity } from './entities/product.entity';
import {
  paginatedFind,
  PaginationOptions,
} from '../common/pagination/paginatedFind';
import { MessageType, ProductLogEntity } from './entities/productLog.entity';
import { RecipesService } from '../recipes/recipes.service';

type Product = {
  name: string;
  unit: string;
  amount: number;
};

@Injectable()
export class ProductsService {
  constructor(
    private readonly recipesService: RecipesService,

    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,

    @InjectRepository(ProductLogEntity)
    private readonly productLogRepository: Repository<ProductLogEntity>,

    // TODO: How to add the user into the type correctly
    @Inject(REQUEST) private readonly request: Request & { user: any },
  ) {}

  async createProduct(product: Product) {
    return await this.productRepository.save({
      ...product,
      log: [{ messageType: MessageType.UPDATED_BY_PRODUCT }],
      owner: { id: this.request.user.id },
    });
  }

  async createProductByRecipes(recipeIds: string[]) {
    const recipes = await this.recipesService.getRecipes(recipeIds);

    // TODO: Code below is just AI crap, refactoring needed.

    const ingredientsByRecipes = recipes.reduce(
      (acc, recipe) => acc.concat(recipe.ingredients),
      [],
    );

    const groupedIngredients = ingredientsByRecipes.reduce(
      (acc, ingredient) => {
        const existingIngredient = acc.find(
          (item) =>
            item.name === ingredient.name && item.unit === ingredient.unit,
        );

        if (existingIngredient) {
          existingIngredient.amount += ingredient.amount;
        } else {
          acc.push({ ...ingredient });
        }

        return acc;
      },
      [],
    );

    for (const ingredient of groupedIngredients) {
      const existingProduct = await this.productRepository.findOne({
        where: {
          name: ingredient.name,
          unit: ingredient.unit,
          owner: { id: this.request.user.id },
        },
      });

      if (existingProduct) {
        await this.productRepository.save({
          ...existingProduct,
          amount: existingProduct.amount + ingredient.amount,
          log: [
            ...(existingProduct.log || []),
            { messageType: MessageType.UPDATED_BY_RECIPE },
          ],
        });
      } else {
        await this.productRepository.save({
          ...ingredient,
          log: [{ messageType: MessageType.CREATED_BY_RECIPE }],
          owner: { id: this.request.user.id },
        });
      }
    }

    return { products: [] };
  }

  async getProductsPage(filter: PaginationOptions) {
    const { content, ...pagination } = await paginatedFind(
      this.productRepository,
      {
        options: filter,
        where: {
          name: filter.filter ? ILike(`%${filter.filter}%`) : undefined,
          owner: { id: this.request.user.id },
        },
      },
    );

    return {
      ...pagination,
      content: content.map((product) => ({
        ...product,
        log: product.log.map((log) => ({ ...log })),
      })),
    };
  }

  async getProduct(id: string) {
    const product = await this.productRepository.findOne({
      where: {
        id,
        owner: { id: this.request.user.id },
      },
    });

    if (!product) {
      throw new NotFoundException();
    }

    return product;
  }

  async updateProduct(id: string, updateProductDto: ProductRequestDto) {
    const product = await this.productRepository.findOne({
      where: {
        id,
        owner: { id: this.request.user.id },
      },
    });

    if (!product) {
      throw new NotFoundException();
    }

    return await this.productRepository.save({
      ...updateProductDto,
      log: [
        ...(product.log || []),
        { messageType: MessageType.UPDATED_BY_PRODUCT },
      ],
      id,
      owner: { id: this.request.user.id },
    });
  }

  async removeProduct(id: string) {
    const product = await this.productRepository.findOne({
      where: {
        id,
        owner: { id: this.request.user.id },
      },
    });

    if (!product) {
      throw new NotFoundException();
    }

    await this.productRepository.delete(product);
  }
}
