import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PlanRequestDto } from './dto/planRequest.dto';
import { REQUEST } from '@nestjs/core';
import { CreatePlanDto } from './dto/createPlan.dto';
import { removeDuplicates } from '../common/utils/arrayUtilities';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserRequest } from '../common/types';
import {
  paginatedFind,
  PaginationOptions,
} from '../common/pagination/paginatedFind';
import { Template } from './template.schema';

@Injectable()
export class TemplatesService {
  constructor(
    @InjectModel(Template.name) private templateModel: Model<Template>,

    @Inject(REQUEST) private readonly request: UserRequest,
  ) {}

  async createTemplate(createPlanDto: CreatePlanDto) {
    await this.checkRecipseExistence(createPlanDto);

    const meals = createPlanDto.meals?.map((meal) => ({
      ...meal,
      recipe: { id: meal.recipeId },
    }));

    const createdTemplateDocument = new this.templateModel({
      ...createPlanDto,
      meals,
      owner: { id: this.request.user.id },
    });

    await createdTemplateDocument.save();

    return await this.templateModel
      .findOne({ id: createdTemplateDocument.id })
      .populate('recipes')
      .lean()
      .exec();
  }

  async getTemplates(filter: PaginationOptions) {
    return await paginatedFind(this.templateModel, {
      options: filter,
      find: {
        name: { $regex: filter.filter ?? '', $options: 'i' },
      },
    });
  }

  async getTemplate(id: string) {
    const templateDocument = await this.templateModel
      .findOne({
        id,
        owner: { id: this.request.user.id },
      })
      .populate('recipes')
      .lean()
      .exec();

    if (!templateDocument) {
      throw new NotFoundException();
    }

    return templateDocument;
  }

  async updateTemplate(id: string, planRequestDto: PlanRequestDto) {
    await this.checkRecipseExistence(planRequestDto);

    const templateDocument = await this.templateModel.findOne({
      id,
      owner: { id: this.request.user.id },
    });

    if (!templateDocument) {
      throw new NotFoundException();
    }

    const meals = planRequestDto.meals?.map((meal) => ({
      ...meal,
      recipe: { id: meal.recipeId },
    }));

    const createdTemplateDocument = new this.templateModel({
      ...planRequestDto,
      meals,
      id,
    });

    await createdTemplateDocument.save();

    return await this.templateModel
      .findOne({ id })
      .populate('recipes')
      .lean()
      .exec();
  }

  async removeTemplate(id: string) {
    const templateDocument = await this.templateModel
      .findOne({
        id,
        owner: { id: this.request.user.id },
      })
      .exec();

    if (!templateDocument) {
      throw new NotFoundException();
    }

    await this.templateModel.deleteOne({ id });
  }

  private async checkRecipseExistence(plan: PlanRequestDto) {
    const recipeIds = removeDuplicates(plan.meals.map((meal) => meal.recipeId));
    const recipse = await this.templateModel.find({
      where: {
        id: { $in: recipeIds },
        owner: { id: this.request.user.id },
      },
    });

    if (recipse.length !== recipeIds.length) {
      throw new ConflictException();
    }
  }
}
