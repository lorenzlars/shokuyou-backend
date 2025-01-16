import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PlanEntity } from './plan.entity';
import { RecipeEntity } from '../../recipes/entities/recipe.entity';
import { ScheduledMealEntity } from '../../scheduled_meals/entities/scheduled_meal.entity';

@Entity({ name: 'meals' })
export class MealEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // TODO: validate days set in plan
  @Column()
  dayIndex: number;

  // @Column()
  // timeIndex: number;

  @ManyToOne(() => RecipeEntity, (recipe) => recipe.meals)
  @JoinColumn()
  recipe: RecipeEntity;

  @ManyToOne(() => PlanEntity, (plan) => plan.meals, {
    onDelete: 'CASCADE',
  })
  plan: PlanEntity;

  @ManyToOne(() => ScheduledMealEntity, (scheduledMeal) => scheduledMeal.meal)
  scheduless: ScheduledMealEntity;
}
