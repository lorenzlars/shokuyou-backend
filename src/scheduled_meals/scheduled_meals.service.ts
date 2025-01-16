import { Injectable } from '@nestjs/common';
import { CreateScheduledMealDto } from './dto/create-scheduled_meal.dto';
import { UpdateScheduledMealDto } from './dto/update-scheduled_meal.dto';

@Injectable()
export class ScheduledMealsService {
  create(_createScheduledMealDto: CreateScheduledMealDto) {
    return 'This action adds a new scheduledMeal';
  }

  findAll() {
    return `This action returns all scheduledMeals`;
  }

  findOne(id: number) {
    return `This action returns a #${id} scheduledMeal`;
  }

  update(id: number, _updateScheduledMealDto: UpdateScheduledMealDto) {
    return `This action updates a #${id} scheduledMeal`;
  }

  remove(id: number) {
    return `This action removes a #${id} scheduledMeal`;
  }
}
