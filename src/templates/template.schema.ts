import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, Document } from 'mongoose';
import { Recipe } from '../recipes/recipe.schema';
import { User } from '../users/user.schema';

export type TemplateSchema = HydratedDocument<Template>;

type Meal = {
  recipe: Recipe;
  dayIndex: number;
  datetime: string;
};

@Schema({ timestamps: true })
export class Template extends Document {
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  days: number;

  @Prop({
    type: [
      {
        recipe: { type: Types.ObjectId, ref: () => Recipe, required: true },
        dayIndex: { type: Number, required: true },
        datetime: { type: String, required: true },
      },
    ],
  })
  meals: Meal[];

  @Prop({ type: Types.ObjectId, ref: () => User })
  owner: User;
}

export const TemplateSchema = SchemaFactory.createForClass(Template);
