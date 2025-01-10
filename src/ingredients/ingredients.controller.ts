import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiQuery,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { ApiPaginatedResponse } from '../common/decorators/apiPaginationResponse';
import { PaginationRequestFilterQueryDto } from '../common/dto/paginationRequestFilterQueryDto';
import { TransformResponse } from '../common/interceptors/responseTransformInterceptor';
import { PaginationResponseDto } from '../common/dto/paginationResponse.dto';
import { IngredientResponseDto } from './dto/ingredientResponse.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { IngredientsService } from './ingredients.service';
import { IngredientRequestDto } from './dto/ingredientRequest.dto';

@ApiTags('ingredients')
@ApiSecurity('access-token')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({
  path: 'ingredients',
  version: '1',
})
export class IngredientsController {
  constructor(private readonly ingredientsService: IngredientsService) {}

  @ApiOperation({
    operationId: 'createIngredient',
  })
  @ApiCreatedResponse({
    type: IngredientResponseDto,
  })
  @ApiBody({
    type: IngredientRequestDto,
  })
  @TransformResponse(IngredientResponseDto)
  @Post()
  async createIngredient(@Body() ingredientRequestDto: IngredientRequestDto) {
    return await this.ingredientsService.create(ingredientRequestDto);
  }

  @ApiOperation({
    operationId: 'getIngredients',
  })
  @ApiPaginatedResponse(IngredientResponseDto)
  @ApiQuery({
    type: PaginationRequestFilterQueryDto,
  })
  @TransformResponse(PaginationResponseDto<IngredientResponseDto>)
  @Get()
  async getIngredients(
    @Query() filter: PaginationRequestFilterQueryDto,
  ): Promise<PaginationResponseDto<IngredientResponseDto>> {
    return await this.ingredientsService.getPage(filter);
  }
}
