import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Put,
  Query,
  NotImplementedException,
  BadRequestException,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductRequestDto } from './dto/productRequest.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProductResponseDto } from './dto/productResponse.dto';
import { TransformResponse } from '../common/interceptors/responseTransformInterceptor';
import { ProductPaginatedResponseDto } from './dto/productPaginatedResponse.dto';
import { PaginationRequestFilterQueryDto } from '../common/pagination/dto/paginationRequestFilterQuery.dto';
import {
  AddRecipesRequestDto,
  AddProductRequestDto,
  AddProductRequestType,
} from './dto/addProductsRequests.dto';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { AddProductsResponseDto } from './dto/addProductsResponse.dto';

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
    type: AddProductsResponseDto,
  })
  @ApiExtraModels(AddProductRequestDto, AddRecipesRequestDto)
  @ApiBody({
    schema: {
      oneOf: [
        { $ref: getSchemaPath(AddProductRequestDto) },
        { $ref: getSchemaPath(AddRecipesRequestDto) },
      ],
    },
  })
  @TransformResponse(AddProductsResponseDto)
  @Post()
  async createProduct(
    @Body() addProductDto: AddProductRequestDto | AddRecipesRequestDto,
  ): Promise<AddProductsResponseDto> {
    switch (addProductDto.type) {
      case AddProductRequestType.product:
        const addProductRequestDto = plainToInstance(
          AddProductRequestDto,
          addProductDto,
        );
        await this.manualDtoValidation(addProductRequestDto);
        throw new NotImplementedException();
      case AddProductRequestType.recipes:
        const addRecipesRequestDto = plainToInstance(
          AddRecipesRequestDto,
          addProductDto,
        );
        await this.manualDtoValidation(addRecipesRequestDto);
        throw new NotImplementedException();
    }
  }

  @ApiOperation({
    operationId: 'getProducts',
  })
  @ApiOkResponse({
    type: ProductPaginatedResponseDto,
  })
  @TransformResponse(ProductPaginatedResponseDto)
  @Get()
  async getProducts(
    @Query() _filter: PaginationRequestFilterQueryDto,
  ): Promise<ProductPaginatedResponseDto> {
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
  async getProduct(@Param('id') _id: string): Promise<ProductResponseDto> {
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
  async updateProduct(
    @Param('id') _id: string,
    @Body() _updateProductDto: ProductRequestDto,
  ): Promise<ProductResponseDto> {
    throw new NotImplementedException();
  }

  @ApiOperation({
    operationId: 'deleteProduct',
  })
  @ApiOkResponse()
  @ApiNotFoundResponse()
  @TransformResponse(ProductResponseDto)
  @Delete(':id')
  async deleteProduct(@Param('id') id: string) {
    await this.productsService.removeProduct(id);
  }

  private async manualDtoValidation(dtoInstance: any) {
    const errors = await validate(dtoInstance);

    if (errors.length > 0) {
      const errorMessages = errors.map((error) =>
        Object.values(error.constraints || {}).join(', '),
      );

      throw new BadRequestException(errorMessages);
    }
  }
}
