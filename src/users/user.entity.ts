import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @ApiProperty({
    description: 'The unique identifier of the user',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'The username of the user',
    example: 'john_doe',
  })
  @Column()
  username: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'password123',
  })
  @Column()
  password: string;
}
