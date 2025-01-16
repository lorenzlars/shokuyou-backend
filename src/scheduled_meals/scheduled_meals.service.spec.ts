import { Test, TestingModule } from '@nestjs/testing';
import { ScheduledMealsService } from './scheduled_meals.service';

describe('ScheduledMealsService', () => {
  let service: ScheduledMealsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScheduledMealsService],
    }).compile();

    service = module.get<ScheduledMealsService>(ScheduledMealsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
