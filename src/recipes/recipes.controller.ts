import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  Query,
} from '@nestjs/common';
import { RecipesService } from './recipes.service';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiSecurity,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Recipe } from './recipe.entity';
import { Generic, PaginationDto } from './dto/pagination.dto';
import { PaginationResponseDto } from './dto/pagination-response.dto';

@ApiTags('recipes')
@ApiSecurity('access-token')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiExtraModels(PaginationResponseDto)
@Controller({
  path: 'recipes',
  version: '1',
})
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) { }

  @ApiOperation({
    summary: 'Add a new recipes',
    operationId: 'createRecipe',
  })
  @ApiCreatedResponse({
    description: 'Recipe successfully created',
    type: Recipe,
  })
  @Post()
  async addRecipe(@Body() createRecipeDto: CreateRecipeDto) {
    return await this.recipesService.addRecipe(createRecipeDto);
  }

  @ApiOperation({
    summary: 'Get a single recipe',
    operationId: 'getRecipe',
  })
  @ApiOkResponse({
    description: 'Successfully retrieved the recipe',
    type: Recipe,
  })
  @ApiNotFoundResponse({
    description: 'Recipe not found',
  })
  @Get(':id')
  async getRecipe(@Param('id') id: string) {
    return await this.recipesService.findOne(id);
  }

  @ApiOperation({
    summary: 'Get all recipes with pagination',
    operationId: 'getRecipes',
  })
  @ApiOkResponse({
    description: 'Successfully retrieved the recipes',
    schema: {
      allOf: [
        { $ref: getSchemaPath(PaginationResponseDto) },
        {
          properties: {
            content: {
              type: 'array',
              items: { $ref: getSchemaPath(Recipe) },
            },
          },
        },
      ],
    },
  })
  @ApiQuery({
    type: PaginationDto,
  })
  @Get()
  async getRecipes(
    @Query() filter: PaginationDto & Generic,
  ): Promise<PaginationResponseDto<Recipe>> {
    const [recipes, total] = await this.recipesService.findAll(filter);

    return {
      ...filter,
      content: recipes,
      total,
    };
  }

  @ApiOperation({
    summary: 'Update a single recipe',
    operationId: 'updateRecipe',
    parameters: [{ name: 'id', in: 'path', description: 'Id of the recipe' }],
  })
  @ApiOkResponse({
    description: 'Successfully updated the recipe',
    type: Recipe,
  })
  @ApiNotFoundResponse({
    description: 'Recipe not found',
  })
  @Patch(':id')
  async updateRecipe(
    @Param('id') id: string,
    @Body() updateRecipeDto: UpdateRecipeDto,
  ) {
    return await this.recipesService.updateRecipe(id, updateRecipeDto);
  }

  @ApiOperation({
    summary: 'Delete a single recipe',
    operationId: 'deleteRecipe',
    parameters: [{ name: 'id', in: 'path', description: 'Id of the recipe' }],
  })
  @ApiOkResponse({
    description: 'Successfully deleted the recipe',
  })
  @ApiNotFoundResponse({
    description: 'Recipe not found',
  })
  @Delete(':id')
  async deleteRecipe(@Param('id') id: string) {
    await this.recipesService.removeRecipe(id);
  }
}
