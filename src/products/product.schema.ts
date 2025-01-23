import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from '../users/user.schema';

export type ProductSchema = HydratedDocument<Product>;

export enum MessageType {
  'UPDATED_BY_PRODUCT' = 'updatedByProduct',
  'UPDATED_BY_RECIPE' = 'updatedByRecipe',
  'CREATED_BY_RECIPE' = 'createdByRecipe',
  'CREATED_BY_PRODUCT' = 'createdByProduct',
}

type LogEntry = {
  messageType: MessageType;
  messageProperties: Record<string, string | number>;
};

@Schema({ timestamps: true })
export class Product {
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  unit: string;

  @Prop()
  amount: number;

  @Prop()
  checked?: boolean;

  @Prop({
    type: [
      {
        messageType: { type: String, enum: MessageType, required: true },
        messageProperties: { type: Object },
      },
    ],
  })
  log: LogEntry[];

  @Prop({ type: Types.ObjectId, ref: () => User })
  owner: User;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
