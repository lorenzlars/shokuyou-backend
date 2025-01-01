import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { ImageEntity } from '../images/image.entity';
import { Optional } from '@nestjs/common';

@Entity({ name: 'recipes' })
export class RecipeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @OneToOne(() => ImageEntity, { nullable: true })
  @JoinColumn()
  @Optional()
  image?: ImageEntity;
}
