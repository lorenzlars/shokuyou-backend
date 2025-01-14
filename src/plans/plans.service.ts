import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PlanRequestDto } from './dto/planRequest.dto';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { REQUEST } from '@nestjs/core';
import { MealEntity } from './entities/meal.entity';
import { PlanEntity } from './entities/plan.entity';
import { CreatePlanDto } from './dto/createPlan.dto';

@Injectable()
export class PlansService {
  constructor(
    private dataSource: DataSource,

    @InjectRepository(PlanEntity)
    private planEntityRepository: Repository<PlanEntity>,

    @InjectRepository(MealEntity)
    private mealEntityRepository: Repository<MealEntity>,

    // TODO: How to add the user into the type correctly
    @Inject(REQUEST) private readonly request: Request & { user: any },
  ) {}

  async create(plan: CreatePlanDto) {
    const meals = plan.meals.map((meal) => ({
      ...meal,
      recipe: { id: meal.recipeId },
    }));

    const createdMeal = await this.planEntityRepository.save({
      ...plan,
      meals,
      owner: { id: this.request.user.id },
    });

    return await this.planEntityRepository.findOne({
      where: { id: createdMeal.id },
      relations: ['meals', 'meals.recipe'],
    });
  }

  async findAll() {
    const [content, total] = await this.planEntityRepository.findAndCount({
      where: {
        owner: { id: this.request.user.id },
      },
    });

    return {
      content,
      total,
    };
  }

  async findOne(id: string) {
    const plan = await this.planEntityRepository.findOne({
      where: {
        id,
        owner: { id: this.request.user.id },
      },
      relations: ['meals', 'meals.recipe'],
    });

    if (!plan) {
      throw new NotFoundException();
    }

    return plan;
  }

  update(id: number, _planRequestDto: PlanRequestDto) {
    return `This action updates a #${id} plan`;
  }

  async remove(id: string) {
    const plan = await this.planEntityRepository.findOne({
      where: {
        id,
        owner: { id: this.request.user.id },
      },
    });

    if (!plan) {
      throw new NotFoundException();
    }
  }
}
