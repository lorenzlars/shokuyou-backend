import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../../users/user.entity';
import { RecipeEntity } from '../../recipes/entities/recipe.entity';

@Entity({ name: 'scheduled_meals' })
export class ScheduledMealEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp' })
  datetime: string;

  @Column({ nullable: true })
  done?: boolean;

  @ManyToOne(() => RecipeEntity, (recipe) => recipe.schedules)
  @JoinColumn()
  recipe: RecipeEntity;

  @ManyToOne(() => UserEntity, (user) => user.scheduledMeals)
  owner: UserEntity;
}
