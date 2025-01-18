import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ProductRequestDto } from './dto/productRequest.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { ProductEntity } from './entities/product.entity';
import {
  paginatedFind,
  PaginationOptions,
} from '../common/pagination/paginatedFind';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,

    // TODO: How to add the user into the type correctly
    @Inject(REQUEST) private readonly request: Request & { user: any },
  ) {}

  async createProduct(productRequestDtodsf: ProductRequestDto) {
    return await this.productRepository.save({
      ...productRequestDtodsf,
      owner: { id: this.request.user.id },
    });
  }

  async getProductsPage(filter: PaginationOptions) {
    return await paginatedFind(this.productRepository, {
      options: filter,
      where: {
        name: filter.filter ? ILike(`%${filter.filter}%`) : undefined,
        owner: { id: this.request.user.id },
      },
    });
  }

  async getProduct(id: string) {
    const product = await this.productRepository.findOne({
      where: {
        id,
        owner: { id: this.request.user.id },
      },
    });

    if (!product) {
      throw new NotFoundException();
    }

    return product;
  }

  async updateProduct(id: string, updateProductDto: ProductRequestDto) {
    const product = await this.productRepository.findOne({
      where: {
        id,
        owner: { id: this.request.user.id },
      },
    });

    if (!product) {
      throw new NotFoundException();
    }

    return await this.productRepository.save({
      ...updateProductDto,
      id,
      owner: { id: this.request.user.id },
    });
  }

  async removeProduct(id: string) {
    const product = await this.productRepository.findOne({
      where: {
        id,
        owner: { id: this.request.user.id },
      },
    });

    if (!product) {
      throw new NotFoundException();
    }

    await this.productRepository.delete(product);
  }
}
