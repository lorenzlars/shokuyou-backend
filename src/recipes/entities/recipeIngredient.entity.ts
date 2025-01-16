import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

import { RecipeEntity } from './recipe.entity';
import { IngredientEntity } from '../../ingredients/ingredient.entity';

@Entity({ name: 'recipes_ingredients' })
export class RecipeIngredientEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => IngredientEntity, (ingredient) => ingredient.recipes, {
    eager: true,
  })
  ingredient: IngredientEntity;

  @ManyToOne(() => RecipeEntity, (recipe) => recipe.ingredients, {
    onDelete: 'CASCADE',
  })
  recipe: RecipeEntity;

  @Column()
  unit: string;

  @Column()
  amount: number;
}
