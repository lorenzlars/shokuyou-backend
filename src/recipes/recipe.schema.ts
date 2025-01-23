import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from '../users/user.schema';

export type RecipeSchema = HydratedDocument<Recipe>;

type RecipeIngredient = {
  name: string;
  amount: number;
  unit: string;
};

@Schema({ timestamps: true })
export class Recipe {
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop()
  source?: string;

  @Prop()
  servings?: number;

  @Prop()
  duration?: number;

  @Prop()
  instructions?: string;

  @Prop()
  nutrition?: string;

  @Prop()
  notes?: string;

  @Prop({
    type: [
      {
        name: { type: String, required: true },
        amount: { type: Number, required: true },
        unit: { type: String, required: true },
      },
    ],
  })
  ingredients: RecipeIngredient[];

  @Prop({ type: Types.ObjectId, ref: () => User })
  owner: Types.ObjectId | User;
}

export const RecipeSchema = SchemaFactory.createForClass(Recipe);
