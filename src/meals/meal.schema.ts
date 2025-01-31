import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Recipe } from '../recipes/recipe.schema';
import { User } from '../users/user.schema';

export type MealSchema = HydratedDocument<Meal>;

@Schema({ timestamps: true })
export class Meal {
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  datetime: string;

  @Prop()
  done?: boolean;

  @Prop({ type: Types.ObjectId, ref: () => Recipe })
  recipe: Recipe;

  @Prop({ type: Types.ObjectId, ref: () => User })
  owner: User;
}

export const MealSchema = SchemaFactory.createForClass(Meal);
