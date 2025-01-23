import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import { Ingredient } from './ingredient.schema';
import {
  paginatedFind,
  PaginationOptions,
} from '../common/pagination/paginatedFind';
import { UserRequest } from '../common/types';

@Injectable()
export class IngredientsService {
  constructor(
    @InjectModel(Ingredient.name) private ingredientModel: Model<Ingredient>,

    @Inject(REQUEST) private readonly request: UserRequest,
  ) {}

  async createIngredient(data: Ingredient, clientSession?: ClientSession) {
    const ingredient = new this.ingredientModel({
      ...data,
      owner: { id: this.request.user.id },
    });

    if (clientSession) {
      ingredient.$session(clientSession);
    }

    await ingredient.save();
  }

  async createMissingIngredients(
    ingredients: Ingredient[],
    clientSession?: ClientSession,
  ) {
    const ingredientQuery = this.ingredientModel.find({
      name: { $in: ingredients.map((ingredient) => ingredient.name) },
    });

    if (clientSession) {
      ingredientQuery.session(clientSession);
    }

    const existing = await ingredientQuery.exec();

    const existingNames = existing.map(
      (existingIngredient) => existingIngredient.name,
    );
    const toCreateIngredients = ingredients.filter(
      (ingredient) => !existingNames.includes(ingredient.name),
    );

    await this.ingredientModel.bulkSave(
      toCreateIngredients.map(
        (ingredient) =>
          new this.ingredientModel({
            ...ingredient,
            owner: { id: this.request.user.id },
          }),
      ),
    );

    return [...existing, ...toCreateIngredients];
  }

  async getIngredientPage(filter: PaginationOptions) {
    return await paginatedFind(this.ingredientModel, {
      options: filter,
      find: {
        name: { $regex: filter.filter ?? '', $options: 'i' },
      },
      callback: (query) => query.populate('recipes'),
    });
  }

  async getIngredient(id: string) {
    const ingredient = await this.ingredientModel
      .findOne({
        _id: id,
        owner: { id: this.request.user.id },
      })
      .populate('recipes')
      .exec();

    if (!ingredient) {
      throw new NotFoundException();
    }

    return ingredient;
  }

  async updateIngredient(
    id: string,
    data: Partial<Ingredient>,
    clientSession?: ClientSession,
  ) {
    const ingredientQuery = this.ingredientModel.findOne({ id });

    if (clientSession) {
      ingredientQuery.session(clientSession);
    }

    const ingredient = await ingredientQuery.exec();

    if (!ingredient) {
      throw new NotFoundException();
    }

    Object.assign(ingredient, data);

    return await ingredient.save();
  }

  async removeIngredient(id: string, clientSession?: ClientSession) {
    const ingredientQuery = this.ingredientModel
      .findOne({ _id: id })
      .populate('recipes');

    if (clientSession) {
      ingredientQuery.session(clientSession);
    }

    const ingredient = await ingredientQuery.exec();

    if (!ingredient) {
      throw new NotFoundException();
    }

    await this.ingredientModel.deleteOne({ _id: id });
  }
}
