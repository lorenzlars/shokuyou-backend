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
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateRecipeDto } from './dto/create-recip.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Recipe } from './recipe.entity';

@ApiTags('recipes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
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
    await this.recipesService.addRecipe(createRecipeDto);
  }

  @ApiOperation({
    summary: 'Get a single recipe',
    operationId: 'getRecipe',
  })
  @ApiOkResponse({
    description: 'Successfully retrieved the recipe',
    type: Recipe,
  })
  @Get(':id')
  async getRecipe(@Param('id') id: string) {
    await this.recipesService.findOne(id);
  }

  @ApiOperation({
    summary: 'Get all recipe',
    operationId: 'getRecipes',
  })
  @ApiOkResponse({
    description: 'Successfully retrieved the recipes',
    type: [Recipe],
  })
  @Get()
  async getRecipes() {
    await this.recipesService.findAll();
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
  @Patch(':id')
  async updateRecipe(
    @Param('id') id: string,
    @Body() updateRecipeDto: UpdateRecipeDto,
  ) {
    await this.recipesService.updateRecipe(id, updateRecipeDto);
  }

  @ApiOperation({
    summary: 'Delete a single recipe',
    operationId: 'deleteRecipe',
    parameters: [{ name: 'id', in: 'path', description: 'Id of the recipe' }],
  })
  @ApiOkResponse({
    description: 'Successfully deleted the recipe',
  })
  @Delete(':id')
  async deleteRecipe(@Param('id') id: string) {
    await this.recipesService.removeRecipe(id);
  }
}
