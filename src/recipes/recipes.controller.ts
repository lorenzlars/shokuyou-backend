import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
  Query,
  UploadedFile,
  UseInterceptors,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  ParseUUIDPipe,
  Put,
} from '@nestjs/common';
import { RecipesService } from './recipes.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiConsumes,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PaginationRequestFilterQueryDto } from '../common/dto/paginationRequestFilterQuery.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { RecipeResponseDto } from './dto/recipeResponse.dto';
import { RecipeRequestDto } from './dto/recipeRequest.dto';
import { TransformResponse } from '../common/interceptors/responseTransformInterceptor';
import { RecipePaginatedResponseDto } from './dto/recipePaginatedResponse.dto';
import { ImportRecipesService } from '../data/importRecipes.service';

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
    private readonly recipesImportService: ImportRecipesService,
  ) {}

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
  @ApiQuery({
    type: PaginationRequestFilterQueryDto,
  })
  @TransformResponse(RecipePaginatedResponseDto)
  @Get()
  async getRecipes(
    @Query() filter: PaginationRequestFilterQueryDto,
  ): Promise<RecipePaginatedResponseDto> {
    return await this.recipesService.getRecipePage(filter);
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
    @Param('id', new ParseUUIDPipe()) id: string,
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
    type: RecipeResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'No Recipe found to add the image to',
  })
  @ApiConsumes('multipart/form-data')
  @TransformResponse(RecipeResponseDto)
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
  ): Promise<RecipeResponseDto> {
    return await this.recipesService.addImage(id, file);
  }

  @ApiOperation({
    summary: 'Replace the image of the recipe',
    operationId: 'updateImage',
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
    type: RecipeResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'No Recipe found to update the image at',
  })
  @ApiConsumes('multipart/form-data')
  @TransformResponse(RecipeResponseDto)
  @Put(':id/image')
  @UseInterceptors(FileInterceptor('file'))
  async updateImage(
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
  ): Promise<RecipeResponseDto> {
    return await this.recipesService.updateImage(id, file);
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
    await this.recipesService.removeImage(id);
  }
}
