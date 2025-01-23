import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type IngredientSchema = HydratedDocument<Ingredient>;

@Schema({ timestamps: true })
export class Ingredient {
  id: string;

  @Prop({ required: true })
  name: string;
}

export const IngredientSchema = SchemaFactory.createForClass(Ingredient);
