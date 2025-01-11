import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  Index,
  OneToMany,
} from 'typeorm';
import { UserEntity } from '../users/user.entity';
import { RecipeIngredientEntity } from '../recipes/entities/recipeIngredient.entity';

@Entity({ name: 'ingredients' })
@Index('unique_name_unit', ['id', 'name', 'owner'], { unique: true })
export class IngredientEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @OneToMany(
    () => RecipeIngredientEntity,
    (recipeIngredient) => recipeIngredient.ingredient,
    {
      nullable: true,
      cascade: true,
    },
  )
  recipes?: RecipeIngredientEntity[];

  @ManyToOne(() => UserEntity, (user) => user.recipes)
  owner: UserEntity;
}
