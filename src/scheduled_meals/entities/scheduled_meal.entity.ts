import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../../users/user.entity';
import { RecipeEntity } from '../../recipes/entities/recipe.entity';

@Entity({ name: 'scheduled_meals' })
export class ScheduledMealEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  timestamp: Date;

  @Column()
  done?: boolean;

  @ManyToOne(() => RecipeEntity, (recipe) => recipe.schedules)
  recipe: RecipeEntity;

  @ManyToOne(() => UserEntity, (user) => user.scheduledMeals)
  owner: UserEntity;
}
