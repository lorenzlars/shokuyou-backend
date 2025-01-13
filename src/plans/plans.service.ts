import { Inject, Injectable } from '@nestjs/common';
import { PlanRequestDto } from './dto/planRequest.dto';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { REQUEST } from '@nestjs/core';
import { MealEntity } from './entities/meal.entity';
import { PlanEntity } from './entities/plan.entity';

type Meal = {
  dayIndex: number;
  recipe: { id: string };
};

type Plan = {
  name: string;
  meals: Meal[];
};

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

  async create(plan: Plan) {
    return await this.planEntityRepository.save({
      ...plan,
      owner: { id: this.request.user.id },
    });
  }

  async findAll() {
    const [content, total] = await this.planEntityRepository.findAndCount();

    return {
      content,
      total,
    };
  }

  findOne(id: string) {
    return this.planEntityRepository.findOne({
      where: {
        id,
        owner: { id: this.request.user.id },
      },
    });
  }

  update(id: number, _planRequestDto: PlanRequestDto) {
    return `This action updates a #${id} plan`;
  }

  remove(id: number) {
    return `This action removes a #${id} plan`;
  }
}
