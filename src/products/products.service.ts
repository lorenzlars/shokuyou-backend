import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ProductRequestDto } from './dto/productRequest.dto';
import { REQUEST } from '@nestjs/core';
import { RecipesService } from '../recipes/recipes.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MessageType, Product } from './product.schema';
import { UserRequest } from '../common/types';
import {
  paginatedFind,
  PaginationOptions,
} from '../common/pagination/paginatedFind';

type ProductType = {
  name: string;
  unit: string;
  amount: number;
};

@Injectable()
export class ProductsService {
  constructor(
    private readonly recipesService: RecipesService,

    @InjectModel(Product.name) private productModel: Model<Product>,

    @Inject(REQUEST) private readonly request: UserRequest,
  ) {}

  async createProduct(product: ProductType) {
    const productDocument = new this.productModel({
      ...product,
      log: [{ messageType: MessageType.UPDATED_BY_PRODUCT }],
      owner: { id: this.request.user.id },
    });

    await productDocument.save();
  }

  async getProducts(filter: PaginationOptions) {
    return await paginatedFind(this.productModel, {
      options: filter,
      find: {
        name: { $regex: filter.filter ?? '', $options: 'i' },
      },
    });
  }

  async getProduct(id: string) {
    const product = await this.productModel
      .findOne({
        id,
        owner: { id: this.request.user.id },
      })
      .lean()
      .exec();

    if (!product) {
      throw new NotFoundException();
    }

    return product;
  }

  async updateProduct(id: string, updateProductDto: ProductRequestDto) {
    const productDocument = await this.productModel
      .findOne({
        id,
        owner: { id: this.request.user.id },
      })
      .lean()
      .exec();

    if (!productDocument) {
      throw new NotFoundException();
    }

    const updatedProductDocument = new this.productModel({
      ...updateProductDto,
      log: [
        ...(productDocument.log || []),
        { messageType: MessageType.UPDATED_BY_PRODUCT },
      ],
      id,
      owner: { id: this.request.user.id },
    });

    return await updatedProductDocument.save();
  }

  async removeProduct(id: string) {
    const productDocument = await this.productModel.findOne({
      id,
      owner: { id: this.request.user.id },
    });

    if (!productDocument) {
      throw new NotFoundException();
    }

    await this.productModel.deleteOne({ id });
  }
}
