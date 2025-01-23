import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { ScheduledMealRequestQueryDto } from './dto/scheduledMealRequestQuery.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Meal } from './meal.schema';
import { UserRequest } from '../common/types';
import { paginatedFind } from '../common/pagination/paginatedFind';

type MealType = {
  datetime: string;
  recipeId: string;
  done?: boolean;
};

@Injectable()
export class ScheduledMealsService {
  constructor(
    @InjectModel(Meal.name) private mealModel: Model<Meal>,

    @Inject(REQUEST) private readonly request: UserRequest,
  ) {}

  async createMeal(meal: MealType) {
    const mealDocument = new this.mealModel({
      ...meal,
      recipe: { id: meal.recipeId },
      owner: { id: this.request.user.id },
    });

    return await mealDocument.save();
  }

  async createMeals(meals: MealType[]) {
    const mealDocuments = meals.map(
      (meal) =>
        new this.mealModel({
          ...meal,
          recipe: { id: meal.recipeId },
          owner: { id: this.request.user.id },
        }),
    );

    await this.mealModel.bulkSave(mealDocuments);
  }

  async getMeals(filter: ScheduledMealRequestQueryDto) {
    return await paginatedFind(this.mealModel, {
      find: {
        datetime: {
          $gte: filter.from,
          $lte: filter.to,
        },
        owner: { id: this.request.user.id },
      },
      callback: (query) => query.populate('recipe'),
    });
  }

  async getMeal(id: string) {
    const mealDocument = await this.mealModel
      .findOne({
        id,
        owner: { id: this.request.user.id },
      })
      .lean()
      .exec();

    if (!mealDocument) {
      throw new NotFoundException();
    }

    return mealDocument;
  }

  async updateMeal(id: string, meal: MealType) {
    const mealDocument = await this.mealModel
      .findOne({
        id,
        owner: { id: this.request.user.id },
      })
      .populate('recipe')
      .exec();

    if (!mealDocument) {
      throw new NotFoundException();
    }

    const updatedMealDocument = new this.mealModel({
      ...mealDocument,
      ...meal,
      id,
      recipe: { id: meal.recipeId ?? mealDocument.recipe.id },
    });

    return await updatedMealDocument.save();
  }

  async removeMeal(id: string) {
    const mealDocument = await this.mealModel.findOne({
      id,
      owner: { id: this.request.user.id },
    });

    if (!mealDocument) {
      throw new NotFoundException();
    }

    await this.mealModel.deleteOne({ id });
  }
}
