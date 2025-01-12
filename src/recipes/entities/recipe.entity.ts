import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { RecipeIngredientEntity } from './recipeIngredient.entity';
import { ImageEntity } from '../../images/image.entity';
import { UserEntity } from '../../users/user.entity';

@Entity({ name: 'recipes' })
export class RecipeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  source?: string;

  @Column({ nullable: true })
  servings?: number;

  @Column({ nullable: true })
  duration?: number;

  @OneToMany(
    () => RecipeIngredientEntity,
    (recipeIngredient) => recipeIngredient.recipe,
    { nullable: true, eager: true, cascade: true },
  )
  ingredients?: RecipeIngredientEntity[];

  @Column({ nullable: true })
  instructions?: string;

  @Column({ nullable: true })
  nutrition?: string;

  @Column({ nullable: true })
  notes?: string;

  @OneToOne(() => ImageEntity, { nullable: true, eager: true })
  @JoinColumn()
  image?: ImageEntity;

  @ManyToOne(() => UserEntity, (user) => user.recipes)
  owner: UserEntity;
}
