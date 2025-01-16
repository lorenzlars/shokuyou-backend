import {
  Body,
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiNotAcceptableResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImportRecipesService, ImportType } from './importRecipes.service';
import { ImportRecipeDto } from './dto/importRecipe.dto';
import { RecipeResponseDto } from '../recipes/dto/recipeResponse.dto';
import { ImportRecipeService } from './importRecipe.service';

@ApiTags('data')
@ApiSecurity('access-token')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({
  path: 'data',
  version: '1',
})
export class DataController {
  constructor(
    private readonly importRecipesService: ImportRecipesService,
    private readonly importRecipeService: ImportRecipeService,
  ) {}

  @ApiOperation({
    operationId: 'importBackup',
  })
  @ApiQuery({
    enum: ImportType,
    enumName: 'ImportType',
    name: 'type',
    required: true,
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
  @ApiOkResponse()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @Post('import/recipes')
  async importBackup(
    @Query('type') type: ImportType,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 100_000_000 }),
          new FileTypeValidator({ fileType: 'application/*' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    await this.importRecipesService.importRecipes(type, file);
  }

  @ApiOperation({
    operationId: 'scrapRecipe',
  })
  @ApiBody({
    type: ImportRecipeDto,
  })
  @ApiOkResponse({
    type: RecipeResponseDto,
  })
  @ApiNotAcceptableResponse()
  @Post('scrap/recipe')
  async scrapRecipe(@Body() importRecipeDto: ImportRecipeDto) {
    return this.importRecipeService.scrapRecipe(importRecipeDto.url);
  }
}
