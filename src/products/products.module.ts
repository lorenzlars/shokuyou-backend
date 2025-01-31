import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { RecipesModule } from '../recipes/recipes.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    RecipesModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [MongooseModule, ProductsService],
})
export class ProductsModule {}
