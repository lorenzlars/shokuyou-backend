import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotImplementedException,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiBearerAuth, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('products')
@ApiSecurity('access-token')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({
  path: 'products',
  version: '1',
})
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() _createProductDto: CreateProductDto) {
    throw new NotImplementedException();
  }

  @Get()
  findAll() {
    throw new NotImplementedException();
  }

  @Get(':id')
  findOne(@Param('id') _id: string) {
    throw new NotImplementedException();
  }

  @Patch(':id')
  update(
    @Param('id') _id: string,
    @Body() _updateProductDto: UpdateProductDto,
  ) {
    throw new NotImplementedException();
  }

  @Delete(':id')
  remove(@Param('id') _id: string) {
    throw new NotImplementedException();
  }
}
