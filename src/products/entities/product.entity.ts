import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../../users/user.entity';
import { ProductLogEntity } from './productLog.entity';

@Entity({ name: 'products' })
export class ProductEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  unit: string;

  @Column()
  amount: number;

  @OneToMany(() => ProductLogEntity, (productLog) => productLog.product)
  log: ProductLogEntity[];

  @ManyToOne(() => UserEntity, (user) => user.products)
  @JoinColumn()
  owner: UserEntity;
}
