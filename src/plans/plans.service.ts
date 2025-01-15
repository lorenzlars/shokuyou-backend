import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PlanRequestDto } from './dto/planRequest.dto';
import { DataSource, In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { REQUEST } from '@nestjs/core';
import { PlanEntity } from './entities/plan.entity';
import { CreatePlanDto } from './dto/createPlan.dto';
import { RecipeEntity } from '../recipes/entities/recipe.entity';
import { removeDuplicates } from '../common/utils/arrayUtilities';

@Injectable()
export class PlansService {
  constructor(
    private dataSource: DataSource,

    @InjectRepository(PlanEntity)
    private planEntityRepository: Repository<PlanEntity>,

    @InjectRepository(RecipeEntity)
    private recipeEntityRepository: Repository<RecipeEntity>,

    // TODO: How to add the user into the type correctly
    @Inject(REQUEST) private readonly request: Request & { user: any },
  ) {}

  async create(createPlanDto: CreatePlanDto) {
    await this.checkRecipseExistence(createPlanDto);

    const meals = createPlanDto.meals?.map((meal) => ({
      ...meal,
      recipe: { id: meal.recipeId },
    }));

    const createdMeal = await this.planEntityRepository.save({
      ...createPlanDto,
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

  async update(id: string, planRequestDto: PlanRequestDto) {
    await this.checkRecipseExistence(planRequestDto);

    const currentPlan = await this.planEntityRepository.findOne({
      where: {
        id,
        owner: { id: this.request.user.id },
      },
    });

    if (!currentPlan) {
      throw new NotFoundException();
    }

    const meals = planRequestDto.meals?.map((meal) => ({
      ...meal,
      recipe: { id: meal.recipeId },
    }));

    await this.planEntityRepository.save({
      ...planRequestDto,
      meals,
      id,
    });

    return await this.planEntityRepository.findOne({
      where: { id },
      relations: ['meals', 'meals.recipe'],
    });
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

    await this.planEntityRepository.delete(plan);
  }

  private async checkRecipseExistence(plan: PlanRequestDto) {
    const recipeIds = removeDuplicates(plan.meals.map((meal) => meal.recipeId));
    const recipse = await this.recipeEntityRepository.find({
      where: {
        id: In(recipeIds),
        owner: { id: this.request.user.id },
      },
    });

    if (recipse.length !== recipeIds.length) {
      throw new ConflictException();
    }
  }
}
