import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { ImageEntity } from '../images/image.entity';
import { UserEntity } from '../users/user.entity';
import { RecipeEntity } from '../recipes/recipe.entity';

@Entity({ name: 'ingredients' })
export class IngredientEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToMany(() => RecipeEntity)
  @JoinTable()
  recipes: RecipeEntity[];

  @ManyToOne(() => UserEntity, (user) => user.recipes)
  owner: UserEntity;
}
