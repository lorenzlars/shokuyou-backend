import {
  Body,
  Controller,
  Delete,
  Get,
  NotImplementedException,
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
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
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
  @ApiBody({
    type: IngredientRequestDto,
  })
  @ApiCreatedResponse({
    type: IngredientResponseDto,
  })
  @TransformResponse(IngredientResponseDto)
  @Post()
  async createIngredient(@Body() ingredientRequestDto: IngredientRequestDto) {
    return await this.ingredientsService.create(ingredientRequestDto);
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
    throw new NotImplementedException();
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
  ): Promise<IngredientResponseDto> {
    throw new NotImplementedException();
  }

  @ApiOperation({
    operationId: 'deleteIngredients',
  })
  @ApiOkResponse({ description: 'Successfully deleted the ingredient' })
  @ApiNotFoundResponse({ description: 'Ingredient not found' })
  @Delete(':id')
  async deleteIngredient(@Param('id', new ParseUUIDPipe()) id: string) {
    throw new NotImplementedException();
  }
}
