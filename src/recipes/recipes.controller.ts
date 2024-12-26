import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateRecipeDto } from './dto/create-recip.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('recipes')
@UseGuards(JwtAuthGuard)
@Controller({
  path: 'recipes',
  version: '1',
})
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @ApiOperation({
    summary: 'Add a new recipe',
    operationId: 'createRecipe',
  })
  @Post()
  addRecipe(@Body() createRecipeDto: CreateRecipeDto) {
    return this.recipesService.addRecipe(createRecipeDto);
  }

  @ApiOperation({
    summary: 'Get a single recipe',
    operationId: 'getRecipeById',
  })
  @Get(':id')
  async getRecipe(@Param('id') id: string) {
    return this.recipesService.findOne(id);
  }

  @ApiOperation({
    summary: 'Get all recipe',
    operationId: 'getRecipes',
    parameters: [
      { name: 'page', in: 'query', description: 'Page number' },
      { name: 'limit', in: 'query', description: 'Page size' },
    ],
  })
  @Get()
  async getRecipes() {
    return this.recipesService.findAll();
  }

  @ApiOperation({
    summary: 'Update a single recipe',
    operationId: 'updateRecipeById',
    parameters: [{ name: 'id', in: 'path', description: 'Id of the recipe' }],
  })
  @Patch(':id')
  async updateRecipe(
    @Param('id') id: string,
    @Body() updateRecipeDto: UpdateRecipeDto,
  ) {
    return this.recipesService.updateRecipe(id, updateRecipeDto);
  }

  @ApiOperation({
    summary: 'Delete a single recipe',
    operationId: 'removeRecipeById',
    parameters: [{ name: 'id', in: 'path', description: 'Id of the recipe' }],
  })
  @Delete(':id')
  async deleteRecipe(@Param('id') id: string) {
    return this.recipesService.removeRecipe(id);
  }
}
