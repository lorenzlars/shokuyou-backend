import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PlanEntity } from './plan.entity';
import { RecipeEntity } from '../../recipes/entities/recipe.entity';

@Entity({ name: 'meals' })
export class MealEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // TODO: validate days set in plan
  @Column()
  dayIndex: number;

  @Column({ type: 'timestamp', nullable: true })
  timestamp?: string;

  @ManyToOne(() => RecipeEntity, (recipe) => recipe.meals)
  recipe: RecipeEntity;

  @ManyToOne(() => PlanEntity, (plan) => plan.meals, {
    onDelete: 'CASCADE',
  })
  plan: PlanEntity;
}
