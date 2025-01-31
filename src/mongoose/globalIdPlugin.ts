import { Schema } from 'mongoose';

export const globalIdPlugin = (schema: Schema) => {
  schema.virtual('id').get(function (this: any) {
    return this._id.toHexString();
  });

  schema.set('toJSON', { virtuals: true });
  schema.set('toObject', { virtuals: true });
};
