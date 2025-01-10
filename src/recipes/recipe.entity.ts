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
import { IngredientEntity } from '../ingredients/ingredient.entity';

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

  @ManyToMany(() => RecipeEntity, { nullable: true })
  @JoinTable()
  ingredients?: IngredientEntity[];

  @Column({ nullable: true })
  instructions?: string;

  @Column({ nullable: true })
  nutrition?: string;

  @Column({ nullable: true })
  notes?: string;

  @OneToOne(() => ImageEntity, { nullable: true })
  @JoinColumn()
  image?: ImageEntity;

  @ManyToOne(() => UserEntity, (user) => user.recipes)
  owner: UserEntity;
}
