import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recipe } from './recipe.entity';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import * as cloudinary from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import {
  PaginationFilterDto,
  SortOrder,
} from '../common/dto/pagination-filter.dto';

@Injectable()
export class RecipesService {
  private readonly logger = new Logger(RecipesService.name);

  constructor(
    @InjectRepository(Recipe)
    private recipeRepository: Repository<Recipe>,

    private configService: ConfigService,
  ) {
    const { username, password } = new URL(configService.get('CLOUDINARY_URL'));

    cloudinary.v2.config({
      secure: true,
      cloud_name: configService.get('CLOUDINARY_CLOUD_NAME'),
      api_key: username,
      api_secret: password,
    });
  }

  private async uploadImage(base64: string) {
    const uploadResult = await new Promise<cloudinary.UploadApiResponse>(
      (resolve) => {
        return cloudinary.v2.uploader
          .upload_stream((error, uploadResult) => {
            this.logger.error(error);
            this.logger.log(uploadResult);

            return resolve(uploadResult);
          })
          .end(base64);
      },
    );

    this.logger.log(uploadResult);

    return uploadResult;
  }

  private createOrderQuery(filter: PaginationFilterDto) {
    const order: any = {};

    if (filter.orderBy) {
      order[filter.orderBy] = filter.sortOrder;

      return order;
    }

    order.name = SortOrder.DESC;

    return order;
  }

  async findAll(filter: PaginationFilterDto) {
    return await this.recipeRepository.findAndCount({
      order: this.createOrderQuery(filter),
      skip: (filter.page - 1) * (filter.pageSize + 1),
      take: filter.pageSize,
    });
  }

  async findOne(id: string) {
    const recipe = await this.recipeRepository.findOne({
      where: { id },
    });

    if (!recipe) {
      throw new NotFoundException();
    }

    return recipe;
  }

  async addRecipe(createRecipeDto: CreateRecipeDto) {
    const { image, ...recipe } = createRecipeDto;

    if (!image) {
      return this.recipeRepository.save(recipe);
    }

    const { url } = await this.uploadImage(image);

    return await this.recipeRepository.save({ ...recipe, url });
  }

  async updateRecipe(id: string, updateRecipeDto: UpdateRecipeDto) {
    const recipe = await this.findOne(id);

    if (!recipe) {
      throw new NotFoundException();
    }

    const { image, ...updatedRecipe } = updateRecipeDto;

    if (image === undefined) {
      return await this.recipeRepository.save({ ...recipe, ...updatedRecipe });
    }

    if (image === null) {
      // TODO: Delete image from cloudinary

      return await this.recipeRepository.save({ ...recipe, ...updatedRecipe });
    }

    const { url } = await this.uploadImage(image);

    return await this.recipeRepository.save({
      ...recipe,
      ...updatedRecipe,
      url,
    });
  }

  async removeRecipe(id: string) {
    const result = await this.recipeRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException();
    }
  }
}
