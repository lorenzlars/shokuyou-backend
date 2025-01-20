import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ProductEntity } from './product.entity';

export enum MessageType {
  'UPDATED_BY_PRODUCT' = 'updatedByProduct',
  'UPDATED_BY_RECIPE' = 'updatedByRecipe',
  'CREATED_BY_RECIPE' = 'createdByRecipe',
  'CREATED_BY_PRODUCT' = 'createdByProduct',
}

@Entity({ name: 'products_logs' })
export class ProductLogEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  messageType: MessageType;

  @Column('json', { nullable: true })
  messageProperties: Record<string, string>;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;

  @ManyToOne(() => ProductEntity, (product) => product.log, {
    onDelete: 'CASCADE',
  })
  product: ProductEntity;
}
