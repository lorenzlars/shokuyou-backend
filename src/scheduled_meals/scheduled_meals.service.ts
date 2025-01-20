import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ScheduledMealRequestDto } from './dto/scheduledMealRequestQuery.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { ScheduledMealEntity } from './entities/scheduled_meal.entity';
import { REQUEST } from '@nestjs/core';

type Meal = {
  datetime: string;
  recipeId: string;
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

  async getScheduledMeals(filter: ScheduledMealRequestDto) {
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

  findOne(id: number) {
    return `This action returns a #${id} scheduledMeal`;
  }

  update(id: number) {
    return `This action updates a #${id} scheduledMeal`;
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
