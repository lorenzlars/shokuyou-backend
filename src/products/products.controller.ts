import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  NotImplementedException,
  UseGuards,
  Put,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductRequestDto } from './dto/productRequest.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProductResponseDto } from './dto/productResponse.dto';
import { TransformResponse } from '../common/interceptors/responseTransformInterceptor';
import { ProductPaginatedResponseDto } from './dto/productPaginatedResponse.dto';
import { PaginationRequestFilterQueryDto } from '../common/dto/paginationRequestFilterQuery.dto';

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

  @ApiOperation({
    summary: 'Add a new product',
    operationId: 'createProduct',
  })
  @ApiCreatedResponse({
    description: 'Product successfully created',
    type: ProductResponseDto,
  })
  @ApiBody({
    type: ProductRequestDto,
  })
  @TransformResponse(ProductResponseDto)
  @Post()
  createProduct(@Body() _createProductDto: ProductRequestDto) {
    throw new NotImplementedException();
  }

  @ApiOperation({
    operationId: 'getProducts',
  })
  @ApiOkResponse({
    type: ProductPaginatedResponseDto,
  })
  @TransformResponse(ProductPaginatedResponseDto)
  @Get()
  getProducts(@Query() _filter: PaginationRequestFilterQueryDto) {
    throw new NotImplementedException();
  }

  @ApiOperation({
    operationId: 'getProduct',
  })
  @ApiOkResponse({
    type: ProductResponseDto,
  })
  @ApiNotFoundResponse()
  @TransformResponse(ProductResponseDto)
  @Get(':id')
  getProduct(@Param('id') _id: string) {
    throw new NotImplementedException();
  }

  @ApiOperation({
    operationId: 'updateProduct',
  })
  @ApiOkResponse({
    type: ProductResponseDto,
  })
  @ApiNotFoundResponse()
  @TransformResponse(ProductResponseDto)
  @Put(':id')
  updateProduct(
    @Param('id') _id: string,
    @Body() _updateProductDto: ProductRequestDto,
  ) {
    throw new NotImplementedException();
  }

  @ApiOperation({
    operationId: 'removeProduct',
  })
  @ApiOkResponse()
  @ApiNotFoundResponse()
  @TransformResponse(ProductResponseDto)
  @Delete(':id')
  removeProduct(@Param('id') _id: string) {
    throw new NotImplementedException();
  }
}
