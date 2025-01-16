import { Test, TestingModule } from '@nestjs/testing';
import { ScheduledMealsController } from './scheduled_meals.controller';
import { ScheduledMealsService } from './scheduled_meals.service';

describe('ScheduledMealsController', () => {
  let controller: ScheduledMealsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScheduledMealsController],
      providers: [ScheduledMealsService],
    }).compile();

    controller = module.get<ScheduledMealsController>(ScheduledMealsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
