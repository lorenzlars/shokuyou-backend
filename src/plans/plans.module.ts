import { Module } from '@nestjs/common';
import { PlansService } from './plans.service';
import { PlansController } from './plans.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanEntity } from './entities/plan.entity';
import { MealEntity } from './entities/meal.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PlanEntity, MealEntity])],
  controllers: [PlansController],
  providers: [PlansService],
  exports: [TypeOrmModule, PlansService],
})
export class PlansModule {}
