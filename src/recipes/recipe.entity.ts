import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { ImageEntity } from '../images/image.entity';

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

  @Column({ nullable: true })
  ingredients?: string;

  @Column({ nullable: true })
  instructions?: string;

  @Column({ nullable: true })
  nutrition?: string;

  @Column({ nullable: true })
  notes?: string;

  @OneToOne(() => ImageEntity, { nullable: true })
  @JoinColumn()
  image?: ImageEntity;
}
