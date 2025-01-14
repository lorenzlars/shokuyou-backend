import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { PaginationRequestFilterQueryDto } from '../common/dto/paginationRequestFilterQuery.dto';
import { TransformResponse } from '../common/interceptors/responseTransformInterceptor';
import { IngredientResponseDto } from './dto/ingredientResponse.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { IngredientsService } from './ingredients.service';
import { IngredientRequestDto } from './dto/ingredientRequest.dto';
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
    operationId: 'createIngredient',
  })
  @ApiBody({
    type: IngredientRequestDto,
  })
  @ApiCreatedResponse({
    type: IngredientResponseDto,
  })
  @TransformResponse(IngredientResponseDto)
  @Post()
  async createIngredient(@Body() ingredientRequestDto: IngredientRequestDto) {
    return await this.ingredientsService.createIngredient(ingredientRequestDto);
  }

  @ApiOperation({
    operationId: 'getIngredient',
  })
  @ApiOkResponse({
    type: IngredientResponseDto,
  })
  @ApiNotFoundResponse()
  @TransformResponse(IngredientResponseDto)
  @Get(':id')
  async getIngredient(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<IngredientResponseDto> {
    return await this.ingredientsService.getIngredient(id);
  }

  @ApiOperation({
    operationId: 'getIngredients',
  })
  @ApiOkResponse({
    type: IngredientPaginatedResponseDto,
  })
  @ApiQuery({
    type: PaginationRequestFilterQueryDto,
  })
  @TransformResponse(IngredientPaginatedResponseDto)
  @Get()
  async getIngredients(
    @Query() filter: PaginationRequestFilterQueryDto,
  ): Promise<IngredientPaginatedResponseDto> {
    return await this.ingredientsService.getIngredientPage(filter);
  }

  @ApiOperation({
    operationId: 'updateIngredients',
  })
  @ApiBody({
    type: IngredientRequestDto,
  })
  @ApiOkResponse({
    type: IngredientResponseDto,
  })
  @ApiNotFoundResponse()
  @TransformResponse(IngredientResponseDto)
  @Put(':id')
  async updateIngredient(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() ingredientRequestDto: IngredientRequestDto,
  ): Promise<IngredientResponseDto> {
    return await this.ingredientsService.updateIngredient(
      id,
      ingredientRequestDto,
    );
  }

  @ApiOperation({
    operationId: 'deleteIngredients',
  })
  @ApiOkResponse({ description: 'Successfully deleted the ingredient' })
  @ApiNotFoundResponse({ description: 'Ingredient not found' })
  @ApiConflictResponse({ description: 'Ingredient is in use' })
  @Delete(':id')
  async deleteIngredient(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.ingredientsService.removeIngredient(id);
  }
}
