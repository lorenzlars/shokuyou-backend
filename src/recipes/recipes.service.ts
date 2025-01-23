import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Recipe } from './recipe.schema';
import { UserRequest } from '../common/types';
import {
  paginatedFind,
  PaginationOptions,
} from '../common/pagination/paginatedFind';

export type RecipeIngredientType = {
  name: string;
  unit: string;
  amount: number;
};

export type RecipeType = {
  name: string;
  description?: string;
  ingredients?: RecipeIngredientType[];
  instructions?: string;
};

@Injectable()
export class RecipesService {
  constructor(
    @InjectModel(Recipe.name) private recipeModel: Model<Recipe>,

    @Inject(REQUEST) private readonly request: UserRequest,
  ) {}

  async getRecipes(filter: PaginationOptions) {
    return await paginatedFind(this.recipeModel, {
      options: filter,
      find: {
        name: { $regex: filter.filter ?? '', $options: 'i' },
        owner: { id: this.request.user.id },
      },
    });
  }

  async getRecipe(id: string) {
    const recipeDocument = await this.recipeModel
      .findOne({
        id,
        owner: { id: this.request.user.id },
      })
      .lean()
      .exec();

    if (!recipeDocument) {
      throw new NotFoundException();
    }

    return recipeDocument;
  }

  async createRecipe(recipe: RecipeType) {
    const recipeDocument = new this.recipeModel({
      ...recipe,
      owner: { id: this.request.user.id },
    });

    return await recipeDocument.save();
  }

  async updateRecipe(id: string, { ingredients, ...recipe }: RecipeType) {
    const recipeDocument = await this.recipeModel
      .findOne({
        id,
        owner: { id: this.request.user.id },
      })
      .exec();

    if (!recipeDocument) {
      throw new NotFoundException();
    }

    Object.assign(recipeDocument, recipe);

    return await recipeDocument.save();
  }

  async removeRecipe(id: string) {
    const recipeDocument = await this.recipeModel
      .findOne({
        id,
        owner: { id: this.request.user.id },
      })
      .exec();

    if (!recipeDocument) {
      throw new NotFoundException();
    }

    await this.recipeModel.deleteOne({ id });
  }
}
