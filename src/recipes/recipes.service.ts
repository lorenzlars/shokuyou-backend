import {
  ConflictException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, ILike, Repository } from 'typeorm';
import { PaginationSortOrder } from '../common/dto/paginationRequestFilterQueryDto';
import { ImagesService } from '../images/images.service';
import { REQUEST } from '@nestjs/core';
import { IngredientsService } from '../ingredients/ingredients.service';
import { RecipeEntity } from './entities/recipe.entity';

export type Ingredient = {
  ingredientId: string;
  unit: string;
  amount: number;
};

export type Recipe = {
  name: string;
  description?: string;
  ingredients?: Ingredient[];
  instructions?: string;
};

type PaginationFilter = {
  page: number;
  pageSize: number;
  orderBy?: string;
  sortOrder?: PaginationSortOrder;
  filter?: string;
};

@Injectable()
export class RecipesService {
  private readonly logger = new Logger(RecipesService.name);

  constructor(
    private dataSource: DataSource,

    private readonly imagesService: ImagesService,

    private readonly ingredientsService: IngredientsService,

    @InjectRepository(RecipeEntity)
    private recipeEntityRepository: Repository<RecipeEntity>,

    // TODO: How to add the user into the type correctly
    @Inject(REQUEST) private readonly request: Request & { user: any },
  ) {}

  private createOrderQuery(filter: PaginationFilter) {
    const order: any = {};

    if (filter.orderBy) {
      order[filter.orderBy] = filter.sortOrder;

      return order;
    }

    order.name = PaginationSortOrder.DESC;

    return order;
  }

  async getRecipePage(filter: PaginationFilter) {
    const [recipes, total] = await this.recipeEntityRepository.findAndCount({
      order: this.createOrderQuery(filter),
      skip: (filter.page - 1) * filter.pageSize,
      take: filter.pageSize,
      relations: ['image', 'ingredients'],
      where: {
        name: filter.filter ? ILike(`%${filter.filter}%`) : undefined, // TODO: Is filter sanitized?
        owner: { id: this.request.user.id },
      },
    });

    const content = recipes.map(({ image, ...recipe }) => ({
      ...recipe,
      ingredients: [],
      imageUrl: image?.url,
    }));

    return {
      ...filter,
      content,
      total,
    };
  }

  async getRecipe(id: string) {
    const recipe = await this.recipeEntityRepository.findOne({
      where: {
        id,
        owner: { id: this.request.user.id },
      },
      relations: {
        image: true,
        ingredients: true,
      },
    });

    if (!recipe) {
      throw new NotFoundException();
    }

    console.log(recipe);

    return {
      ...recipe,
      ingredients: [],
      imageUrl: recipe.image?.url,
    };
  }

  async createRecipe(payload: Recipe) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const recipe = await queryRunner.manager.save(RecipeEntity, {
        ...payload,
        owner: { id: this.request.user.id },
      });

      // if (payload.ingredients) {
      //   // TODO: Only create missing and link existing
      //   await this.ingredientsService.createIngredients(
      //     payload.ingredients.map((ingredient) => ({
      //       ...ingredient,
      //       recipes: [recipe],
      //     })),
      //     queryRunner.manager,
      //   );
      // }

      await queryRunner.commitTransaction();

      return this.getRecipe(recipe.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();

      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async updateRecipe(id: string, recipe: Recipe) {
    const currentRecipe = await this.getRecipe(id);

    if (!currentRecipe) {
      throw new NotFoundException();
    }

    // TODO: Update ingredients
    const { image, ...updatedRecipe } = await this.recipeEntityRepository.save({
      ...currentRecipe,
      ...{ ...recipe, ingredients: [] },
    });

    return {
      ...updatedRecipe,
      imageUrl: image?.url,
    };
  }

  async removeRecipe(id: string) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const recipe = await queryRunner.manager.findOne(RecipeEntity, {
        where: { id },
        relations: ['image'],
      });

      if (!recipe) {
        throw new NotFoundException();
      }

      const imageId = recipe.image?.id;
      // TODO: Can typeorm delete the related entries at once?
      const deleteRecipeResult = await queryRunner.manager.delete(
        RecipeEntity,
        { id: id },
      );

      if (deleteRecipeResult.affected === 0) {
        throw new NotFoundException();
      }

      if (imageId) {
        await this.imagesService.removeImage(imageId, queryRunner.manager);
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();

      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async addImage(id: string, file: Express.Multer.File) {
    const queryRunner = this.dataSource.createQueryRunner();
    let updatedRecipe: RecipeEntity;

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const recipe = await queryRunner.manager.findOne(RecipeEntity, {
        where: { id },
        relations: ['image'],
      });

      if (!recipe) {
        throw new NotFoundException();
      }

      if (recipe.image) {
        throw new ConflictException(
          'Recipe already has an image, only one image is allowed. Use PUT or DELETE to update the image.',
        );
      }

      recipe.image = await this.imagesService.addImage(
        file,
        queryRunner.manager,
      );

      updatedRecipe = await queryRunner.manager.save(recipe);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();

      throw error;
    } finally {
      await queryRunner.release();
    }

    return {
      ...updatedRecipe,
      ingredients: [],
      imageUrl: updatedRecipe.image.url,
    };
  }

  async updateImage(id: string, file: Express.Multer.File) {
    const queryRunner = this.dataSource.createQueryRunner();
    let updatedRecipe: RecipeEntity;

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const recipe = await queryRunner.manager.findOne(RecipeEntity, {
        where: { id },
        relations: ['image'],
      });

      if (!recipe) {
        throw new NotFoundException();
      }

      recipe.image = await this.imagesService.updateImage(
        recipe.image.id,
        file,
        queryRunner.manager,
      );

      updatedRecipe = await queryRunner.manager.save(recipe);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();

      throw error;
    } finally {
      await queryRunner.release();
    }

    return {
      ...updatedRecipe,
      ingredients: [],
      imageUrl: updatedRecipe.image.url,
    };
  }

  async removeImage(id: string) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const recipe = await queryRunner.manager.findOne(RecipeEntity, {
        where: { id },
        relations: ['image'],
      });

      if (!recipe) {
        throw new NotFoundException();
      }

      const imageId = recipe.image?.id;
      recipe.image = null;

      await queryRunner.manager.save(recipe);

      if (imageId) {
        await this.imagesService.removeImage(imageId, queryRunner.manager);
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();

      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
