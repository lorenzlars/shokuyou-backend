import { Injectable } from '@nestjs/common';

@Injectable()
export class ScheduledMealsService {
  create() {
    return 'This action adds a new scheduledMeal';
  }

  findAll() {
    return `This action returns all scheduledMeals`;
  }

  findOne(id: number) {
    return `This action returns a #${id} scheduledMeal`;
  }

  update(id: number) {
    return `This action updates a #${id} scheduledMeal`;
  }

  remove(id: number) {
    return `This action removes a #${id} scheduledMeal`;
  }
}
