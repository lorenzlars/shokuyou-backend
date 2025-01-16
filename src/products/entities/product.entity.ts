import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../../users/user.entity';
import { RecipeEntity } from '../../recipes/entities/recipe.entity';

@Entity({ name: 'products' })
export class ProductEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  unit: string;

  @Column()
  amount: number;

  @ManyToMany(() => RecipeEntity, (recipe) => recipe.products)
  recipes: string;

  @ManyToOne(() => UserEntity, (user) => user.products)
  owner: UserEntity;
}
