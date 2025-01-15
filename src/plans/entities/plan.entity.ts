import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MealEntity } from './meal.entity';
import { UserEntity } from '../../users/user.entity';

@Entity({ name: 'plans' })
export class PlanEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  days: number;

  @OneToMany(() => MealEntity, (meal) => meal.plan, {
    nullable: true,
    cascade: true,
  })
  @JoinColumn()
  meals?: MealEntity[];

  @ManyToOne(() => UserEntity, (user) => user.plans)
  owner: UserEntity;
}
