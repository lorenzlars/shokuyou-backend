import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
  Query,
  ParseUUIDPipe,
  Put,
} from '@nestjs/common';
import { RecipesService } from './recipes.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PaginationRequestFilterQueryDto } from '../common/pagination/dto/paginationRequestFilterQuery.dto';
import { RecipeResponseDto } from './dto/recipeResponse.dto';
import { RecipeRequestDto } from './dto/recipeRequest.dto';
import { TransformResponse } from '../common/interceptors/responseTransformInterceptor';
import { RecipePaginatedResponseDto } from './dto/recipePaginatedResponse.dto';

@ApiTags('recipes')
@ApiSecurity('access-token')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({
  path: 'recipes',
  version: '1',
})
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @ApiOperation({
    summary: 'Add a new recipes',
    operationId: 'createRecipe',
  })
  @ApiCreatedResponse({
    description: 'Recipe successfully created',
    type: RecipeResponseDto,
  })
  @ApiBody({
    type: RecipeRequestDto,
  })
  @TransformResponse(RecipeResponseDto)
  @Post()
  async addRecipe(@Body() recipeRequestDto: RecipeRequestDto) {
    return await this.recipesService.createRecipe(recipeRequestDto);
  }

  @ApiOperation({
    summary: 'Get a single recipe',
    operationId: 'getRecipe',
  })
  @ApiOkResponse({
    description: 'Successfully retrieved the recipe',
    type: RecipeResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Recipe not found',
  })
  @TransformResponse(RecipeResponseDto)
  @Get(':id')
  async getRecipe(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<RecipeResponseDto> {
    return await this.recipesService.getRecipe(id);
  }

  @ApiOperation({
    summary: 'Get all recipes with pagination',
    operationId: 'getRecipes',
  })
  @ApiOkResponse({
    type: RecipePaginatedResponseDto,
  })
  @TransformResponse(RecipePaginatedResponseDto)
  @Get()
  async getRecipes(
    @Query() filter: PaginationRequestFilterQueryDto,
  ): Promise<RecipePaginatedResponseDto> {
    return await this.recipesService.getRecipes(filter);
  }

  @ApiOperation({
    summary: 'Replace a single recipe',
    operationId: 'updateRecipe',
    parameters: [{ name: 'id', in: 'path', description: 'Id of the recipe' }],
  })
  @ApiOkResponse({
    description: 'Successfully updated the recipe',
    type: RecipeResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Recipe not found',
  })
  @ApiBody({
    type: RecipeRequestDto,
  })
  @TransformResponse(RecipeResponseDto)
  @Put(':id')
  async updateRecipe(
    @Param('id') id: string,
    @Body() recipeRequestDto: RecipeRequestDto,
  ): Promise<RecipeResponseDto> {
    return await this.recipesService.updateRecipe(id, recipeRequestDto);
  }

  @ApiOperation({
    summary: 'Delete a single recipe',
    operationId: 'deleteRecipe',
    parameters: [{ name: 'id', in: 'path', description: 'Id of the recipe' }],
  })
  @ApiOkResponse({
    description: 'Successfully deleted the recipe',
  })
  @ApiConflictResponse({
    description: 'Recipe is in use by a plan',
  })
  @ApiNotFoundResponse({
    description: 'Recipe not found',
  })
  @Delete(':id')
  async deleteRecipe(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.recipesService.removeRecipe(id);
  }
}
