import {
  Controller,
  Get,
  Body,
  Param,
  Delete,
  UseGuards,
  Put,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductRequestDto } from './dto/productRequest.dto';
import {
  ApiBearerAuth,
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
import { PaginationRequestFilterQueryDto } from '../common/pagination/dto/paginationRequestFilterQuery.dto';
import { validate } from 'class-validator';

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

  // @ApiOperation({
  //   summary: 'Add a new product',
  //   operationId: 'createProduct',
  // })
  // @ApiCreatedResponse({
  //   description: 'Product successfully created',
  //   type: AddProductsResponseDto,
  // })
  // @ApiExtraModels(AddProductRequestDto, AddRecipesRequestDto)
  // @ApiBody({
  //   schema: {
  //     oneOf: [
  //       { $ref: getSchemaPath(AddProductRequestDto) },
  //       { $ref: getSchemaPath(AddRecipesRequestDto) },
  //     ],
  //   },
  // })
  // @TransformResponse(AddProductsResponseDto)
  // @Post()
  // async createProduct(
  //   @Body() addProductDto: AddProductRequestDto | AddRecipesRequestDto,
  // ): Promise<AddProductsResponseDto> {
  //   const addProductRequestDto = plainToInstance(
  //     AddProductBaseDto,
  //     addProductDto,
  //   );
  //   await this.manualDtoValidation(addProductRequestDto);
  //
  //   switch (addProductDto.type) {
  //     case AddProductRequestType.product:
  //       const addProductRequestDto = plainToInstance(
  //         AddProductRequestDto,
  //         addProductDto,
  //       );
  //       await this.manualDtoValidation(addProductRequestDto);
  //       const product =
  //         await this.productsService.createProduct(addProductRequestDto);
  //
  //       return { products: [product] };
  //     case AddProductRequestType.recipes:
  //       const addRecipesRequestDto = plainToInstance(
  //         AddRecipesRequestDto,
  //         addProductDto,
  //       );
  //       await this.manualDtoValidation(addRecipesRequestDto);
  //
  //       return await this.productsService.createProductByRecipes(
  //         addRecipesRequestDto.recipeIds,
  //       );
  //   }
  // }

  @ApiOperation({
    operationId: 'getProducts',
  })
  @ApiOkResponse({
    type: ProductPaginatedResponseDto,
  })
  @TransformResponse(ProductPaginatedResponseDto)
  @Get()
  async getProducts(
    @Query() filter: PaginationRequestFilterQueryDto,
  ): Promise<ProductPaginatedResponseDto> {
    return await this.productsService.getProducts(filter);
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
  async getProduct(@Param('id') id: string): Promise<ProductResponseDto> {
    return await this.productsService.getProduct(id);
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
    @Param('id') id: string,
    @Body() updateProductDto: ProductRequestDto,
  ): Promise<ProductResponseDto> {
    return await this.productsService.updateProduct(id, updateProductDto);
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
