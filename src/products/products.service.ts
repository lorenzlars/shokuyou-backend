import { Inject, Injectable, NotFoundException } from '@nestjs/common';
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

  async create(productRequestDtodsf: ProductRequestDto) {
    return await this.productRepository.save({
      ...productRequestDtodsf,
      owner: { id: this.request.user.id },
    });
  }

  findAll() {
    return `This action returns all products`;
  }

  async findOne(id: string) {
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

  update(id: number, _updateProductDto: ProductRequestDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
