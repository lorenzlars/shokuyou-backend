import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MealEntity } from '../../plans/entities/meal.entity';
import { UserEntity } from '../../users/user.entity';

@Entity({ name: 'scheduled_meals' })
export class ScheduledMealEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  timestamp: Date;

  @Column()
  done?: boolean;

  @OneToMany((): any => MealEntity, (meal: MealEntity) => meal.scheduless)
  meal: MealEntity;

  @ManyToOne(() => UserEntity, (user) => user.scheduledMeals)
  owner: UserEntity;
}
