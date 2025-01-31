import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { PaginationRequestFilterQueryDto } from '../common/pagination/dto/paginationRequestFilterQuery.dto';
import { TransformResponse } from '../common/interceptors/responseTransformInterceptor';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { IngredientsService } from './ingredients.service';
import { IngredientPaginatedResponseDto } from './dto/ingredientPaginatedResponse.dto';

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
    operationId: 'getIngredients',
  })
  @ApiOkResponse({
    type: IngredientPaginatedResponseDto,
  })
  @TransformResponse(IngredientPaginatedResponseDto)
  @Get()
  async getIngredients(
    @Query() filter: PaginationRequestFilterQueryDto,
  ): Promise<IngredientPaginatedResponseDto> {
    return await this.ingredientsService.getIngredientPage(filter);
  }
}
