import { Inject, Injectable } from '@nestjs/common';
import { ProductRequestDto } from './dto/productRequest.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { ProductEntity } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,

    // TODO: How to add the user into the type correctly
    @Inject(REQUEST) private readonly request: Request & { user: any },
  ) {}

  create(_createProductDto: ProductRequestDto) {
    return 'This action adds a new product';
  }

  findAll() {
    return `This action returns all products`;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, _updateProductDto: ProductRequestDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
