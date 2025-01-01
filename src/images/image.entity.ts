import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'images' })
export class ImageEntity {
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
  publicId: string;

  @ApiProperty()
  @Column()
  url: string;
}
