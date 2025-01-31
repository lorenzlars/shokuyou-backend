import { Module } from '@nestjs/common';
import { ScheduledMealsService } from './meals.service';
import { ScheduledMealsController } from './meals.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Meal, MealSchema } from './meal.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Meal.name, schema: MealSchema }]),
  ],
  controllers: [ScheduledMealsController],
  providers: [ScheduledMealsService],
  exports: [MongooseModule, ScheduledMealsService],
})
export class MealsModule {}
