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
  UploadedFile,
  UseInterceptors,
  NotFoundException,
  NotAcceptableException,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  ParseUUIDPipe,
} from '@nestjs/common';
import { RecipesService } from './recipes.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Recipe } from './recipe.entity';
import { PaginationFilterDto } from '../common/dto/pagination-filter.dto';
import { PaginationResponseDto } from '../common/dto/pagination-response.dto';
import { ApiPaginatedResponse } from '../common/decorators/apiPaginationResponse';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImagesService } from '../images/images.service';
import { ResponseRecipeDto } from './dto/response-recipe.dto';

@ApiTags('recipes')
@ApiSecurity('access-token')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({
  path: 'recipes',
  version: '1',
})
export class RecipesController {
  constructor(
    private readonly recipesService: RecipesService,
    private readonly imagesService: ImagesService,
  ) {}

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
    type: ResponseRecipeDto,
  })
  @ApiNotFoundResponse({
    description: 'Recipe not found',
  })
  @Get(':id')
  async getRecipe(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<ResponseRecipeDto> {
    const { image, ...recipe } = await this.recipesService.findOne(id);

    return {
      ...recipe,
      imageUrl: image?.url,
    };
  }

  @ApiOperation({
    summary: 'Get all recipes with pagination',
    operationId: 'getRecipes',
  })
  @ApiPaginatedResponse(ResponseRecipeDto)
  @Get()
  async getRecipes(
    @Query() filter: PaginationFilterDto,
  ): Promise<PaginationResponseDto<ResponseRecipeDto>> {
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
    @Param('id', new ParseUUIDPipe()) id: string,
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
  async deleteRecipe(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.recipesService.removeRecipe(id);
  }

  @ApiOperation({
    summary: 'Add an image to a recipe',
    operationId: 'uploadImage',
    parameters: [{ name: 'id', in: 'path', description: 'Id of the recipe' }],
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file'],
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Successfully uploaded the image',
    type: ResponseRecipeDto,
  })
  @ApiNotFoundResponse({
    description: 'No Recipe found to add the image to',
  })
  @ApiConsumes('multipart/form-data')
  @Post(':id/image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @Param('id', new ParseUUIDPipe()) id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10_000_000 }),
          new FileTypeValidator({ fileType: 'image/*' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ): Promise<ResponseRecipeDto> {
    // TODO: Use transactions to ensure that the image is only added or deleted if the recipe is updated successfully
    const recipe = await this.recipesService.findOne(id);

    if (recipe.image) {
      await this.imagesService.removeImage(recipe.image.id);
    }

    const image = await this.imagesService.addImage(file);
    const { image: recipeImage, ...updatedRecipe } =
      await this.recipesService.updateRecipe(id, {
        ...recipe,
        image,
      });

    return {
      ...updatedRecipe,
      imageUrl: recipeImage.url,
    };
  }

  @ApiOperation({
    summary: 'Delete an image to from the recipe',
    operationId: 'deleteImage',
    parameters: [{ name: 'id', in: 'path', description: 'Id of the recipe' }],
  })
  @ApiOkResponse({
    description: 'Successfully removed the image',
  })
  @ApiNotFoundResponse({
    description: 'No Recipe found to remove the image from',
  })
  @Delete(':id/image')
  async deleteImage(@Param('id', new ParseUUIDPipe()) id: string) {
    const { image, ...recipe } = await this.recipesService.findOne(id);

    if (!recipe) {
      throw new NotFoundException();
    }

    await this.imagesService.removeImage(image.id);

    return await this.recipesService.updateRecipe(id, recipe);
  }
}
