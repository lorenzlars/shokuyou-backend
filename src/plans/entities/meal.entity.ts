import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PlanEntity } from './plan.entity';
import { RecipeEntity } from '../../recipes/entities/recipe.entity';

@Entity({ name: 'meals' })
export class MealEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  dayIndex: number;

  @Column()
  timeIndex: number;

  @OneToMany(() => RecipeEntity, (recipe) => recipe.meals, {
    eager: true,
  })
  recipe: RecipeEntity;

  @ManyToOne(() => PlanEntity, (plan) => plan.meals)
  plan: PlanEntity;
}
