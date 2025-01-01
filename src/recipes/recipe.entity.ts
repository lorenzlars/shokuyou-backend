import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Image } from '../images/image.entity';
import { Optional } from '@nestjs/common';

@Entity()
export class Recipe {
  @ApiProperty({
    description: 'The unique identifier of the recipe',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'The name of the recipe',
    example: 'Spaghetti Carbonara',
  })
  @Column()
  name: string;

  @ApiProperty({
    description: 'The description of the recipe',
    example: 'A classic Italian pasta dish',
  })
  @Column({ nullable: true })
  description?: string;

  @ApiProperty({
    description: 'The image of the recipe',
    type: Image,
  })
  @OneToOne(() => Image, { nullable: true })
  @JoinColumn()
  @Optional()
  image?: Image;
}
