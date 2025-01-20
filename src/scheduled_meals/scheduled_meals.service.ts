import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { ScheduledMealEntity } from './entities/scheduled_meal.entity';
import { REQUEST } from '@nestjs/core';
import { ScheduledMealRequestQueryDto } from './dto/scheduledMealRequestQuery.dto';

type Meal = {
  datetime: string;
  recipeId: string;
  done?: boolean;
};

@Injectable()
export class ScheduledMealsService {
  constructor(
    @InjectRepository(ScheduledMealEntity)
    private scheduledMealRepository: Repository<ScheduledMealEntity>,

    // TODO: How to add the user into the type correctly
    @Inject(REQUEST) private readonly request: Request & { user: any },
  ) {}

  async create(meals: Meal[]) {
    const createdMeals = await this.scheduledMealRepository.save(
      meals.map((meal) => ({
        ...meal,
        recipe: { id: meal.recipeId },
        owner: { id: this.request.user.id },
      })),
    );

    return { meals: createdMeals };
  }

  async getScheduledMeals(filter: ScheduledMealRequestQueryDto) {
    const [content, total] = await this.scheduledMealRepository.findAndCount({
      where: {
        datetime: Between(filter.from, filter.to),
        owner: { id: this.request.user.id },
      },
      relations: {
        recipe: true,
      },
      order: {
        datetime: 'ASC',
      },
    });

    return {
      content,
      total,
    };
  }

  async findOne(id: string) {
    const schedule = await this.scheduledMealRepository.findOne({
      where: {
        id,
        owner: { id: this.request.user.id },
      },
    });

    if (!schedule) {
      throw new NotFoundException();
    }

    return schedule;
  }

  async update(id: string, meal: Meal) {
    const schedule = await this.scheduledMealRepository.findOne({
      where: {
        id,
        owner: { id: this.request.user.id },
      },
    });

    if (!schedule) {
      throw new NotFoundException();
    }

    return await this.scheduledMealRepository.save({
      ...schedule,
      ...meal,
      id,
      recipe: { id: meal.recipeId ?? schedule.recipe.id },
    });
  }

  async remove(id: string) {
    const scheduledMeal = await this.scheduledMealRepository.findOne({
      where: {
        id,
        owner: { id: this.request.user.id },
      },
    });

    if (!scheduledMeal) {
      throw new NotFoundException();
    }

    await this.scheduledMealRepository.delete({ id });
  }
}
