import { Inject, Injectable } from '@nestjs/common';
import { PlanRequestDto } from './dto/planRequest.dto';
import { DataSource, ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { REQUEST } from '@nestjs/core';
import { MealEntity } from './entities/meal.entity';
import { PlanEntity } from './entities/plan.entity';
import { PaginationSortOrder } from '../common/dto/paginationRequestFilterQueryDto';

type Plan = {
  name: string;
};

type PaginationFilter = {
  page: number;
  pageSize: number;
  orderBy?: string;
  sortOrder?: PaginationSortOrder;
  filter?: string;
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

  async findAll(filter: PaginationFilter) {
    const [plans, total] = await this.planEntityRepository.findAndCount({
      skip: (filter.page - 1) * filter.pageSize,
      take: filter.pageSize,
      where: {
        name: filter.filter ? ILike(`%${filter.filter}%`) : undefined,
        owner: { id: this.request.user.id },
      },
    });

    return {
      ...filter,
      content: plans,
      total,
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} plan`;
  }

  update(id: number, _planRequestDto: PlanRequestDto) {
    return `This action updates a #${id} plan`;
  }

  remove(id: number) {
    return `This action removes a #${id} plan`;
  }
}
