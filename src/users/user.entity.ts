import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { RecipeEntity } from '../recipes/entities/recipe.entity';
import { PlanEntity } from '../plans/entities/plan.entity';
import { IngredientEntity } from '../ingredients/ingredient.entity';
import { ScheduledMealEntity } from '../scheduled_meals/entities/scheduled_meal.entity';
import { ProductEntity } from '../products/entities/product.entity';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  username: string;

  @Column()
  @Exclude({ toPlainOnly: true })
  password: string;

  @OneToMany(() => RecipeEntity, (recipe) => recipe.owner)
  recipes?: RecipeEntity[];

  @OneToMany(() => PlanEntity, (plan) => plan.owner)
  plans?: PlanEntity[];

  @OneToMany(() => IngredientEntity, (ingredient) => ingredient.owner)
  ingredients?: IngredientEntity[];

  @OneToMany(() => ProductEntity, (product) => product.owner)
  products?: ProductEntity[];

  @OneToMany(() => ScheduledMealEntity, (scheduledMeal) => scheduledMeal.owner)
  scheduledMeals?: ScheduledMealEntity[];
}
