import { Module } from '@nestjs/common';
import { ScheduledMealsService } from './scheduled_meals.service';
import { ScheduledMealsController } from './scheduled_meals.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduledMealEntity } from './entities/scheduled_meal.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ScheduledMealEntity])],
  controllers: [ScheduledMealsController],
  providers: [ScheduledMealsService],
  exports: [TypeOrmModule, ScheduledMealsService],
})
export class ScheduledMealsModule {}
