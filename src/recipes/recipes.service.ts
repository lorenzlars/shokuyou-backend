import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { RecipeEntity } from './recipe.entity';
import { PaginationSortOrder } from '../common/dto/paginationRequestFilterQueryDto';
import { ImagesService } from '../images/images.service';

export type Recipe = {
  name: string;
  description?: string;
};

type PaginationFilter = {
  page: number;
  pageSize: number;
  orderBy?: string;
  sortOrder?: PaginationSortOrder;
};

@Injectable()
export class RecipesService {
  private readonly logger = new Logger(RecipesService.name);

  constructor(
    private dataSource: DataSource,

    private readonly imagesService: ImagesService,

    @InjectRepository(RecipeEntity)
    private recipeRepository: Repository<RecipeEntity>,
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

  async getPage(filter: PaginationFilter) {
    const [recipes, total] = await this.recipeRepository.findAndCount({
      order: this.createOrderQuery(filter),
      skip: (filter.page - 1) * filter.pageSize,
      take: filter.pageSize,
      relations: ['image'],
    });

    const content = recipes.map(({ image, ...recipe }) => ({
      ...recipe,
      imageUrl: image?.url,
    }));

    return {
      ...filter,
      content,
      total,
    };
  }

  async getOne(id: string) {
    const recipe = await this.recipeRepository.findOne({
      where: { id },
      relations: ['image'],
      loadEagerRelations: false,
    });

    if (!recipe) {
      throw new NotFoundException();
    }

    return {
      ...recipe,
      imageUrl: recipe.image?.url,
    };
  }

  async createRecipe(recipe: Recipe) {
    return this.recipeRepository.save(recipe);
  }

  async updateRecipe(id: string, recipe: Recipe) {
    const currentRecipe = await this.getOne(id);

    if (!currentRecipe) {
      throw new NotFoundException();
    }

    const { image, ...updatedRecipe } = await this.recipeRepository.save({
      ...currentRecipe,
      ...recipe,
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
      const { image, ...recipe } = await queryRunner.manager.findOne(
        RecipeEntity,
        {
          where: { id },
          relations: ['image'],
        },
      );

      if (!recipe) {
        throw new NotFoundException();
      }

      const deleteRecipeResult = await queryRunner.manager.delete(
        RecipeEntity,
        { id: id },
      );

      if (deleteRecipeResult.affected === 0) {
        throw new NotFoundException();
      }

      await this.imagesService.removeImage(image.id, queryRunner.manager);

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

      const imageId = recipe.image.id;
      recipe.image = null;

      await queryRunner.manager.save(recipe);

      await this.imagesService.removeImage(imageId, queryRunner.manager);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();

      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
