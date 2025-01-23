import { Injectable, Logger, NotImplementedException } from '@nestjs/common';
import AdmZip from 'adm-zip';
import {
  RecipeIngredientType,
  RecipeType,
  RecipesService,
} from '../recipes/recipes.service';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { RecipeRequestDto } from '../recipes/dto/recipeRequest.dto';

export enum ImportType {
  MELA = 'mela',
}

type MelaRecipe = {
  title: string;
  text: string;
  instructions: string;
  images: string[];
  ingredients: string;
};

@Injectable()
export class ImportRecipesService {
  private readonly logger = new Logger(ImportRecipesService.name);

  constructor(private readonly recipesService: RecipesService) {}

  async importRecipes(type: ImportType, file: Express.Multer.File) {
    if (type !== ImportType.MELA) {
      throw new NotImplementedException();
    }

    const melaBackupContainer = new AdmZip(file.buffer);

    for (const file of melaBackupContainer.getEntries()) {
      try {
        const recipe = this.parseMelaRecipe(
          JSON.parse(file.getData().toString()),
        );

        const { images, ...rest } = recipe;
        const dto = plainToInstance(RecipeRequestDto, rest);
        const errors = await validate(dto);

        if (errors.length > 0) {
          this.logger.error(
            `Faild to parse recipe ${file.entryName.slice(0, -11)}`,
            errors,
          );
        }

        await this.recipesService.createRecipe(dto);
      } catch (error) {
        this.logger.error(
          `Faild to import recipe ${file.entryName.slice(0, -11)}`,
          error,
        );
      }
    }
  }

  private parseMelaRecipe(
    recipe: MelaRecipe,
  ): RecipeType & { images: Express.Multer.File[] } {
    console.log(recipe.images);

    return {
      name: recipe.title,
      description: recipe.text,
      instructions: recipe.instructions,
      images: recipe.images.map((base64) =>
        this.base64ToMulterFile(base64, recipe.title),
      ),
      ingredients: this.parseMelaIngredients(recipe.ingredients),
    };
  }

  private parseMelaIngredients(ingredients: string): RecipeIngredientType[] {
    if (!ingredients) {
      return [];
    }

    return ingredients
      .split('\n')
      .map<RecipeIngredientType>((ingredient) => {
        const [, amountString, unit, name] =
          ingredient.match(/^(\S+)\s(\S+)\s(.+)$/) ?? [];

        try {
          if (amountString.includes('/')) {
            const [numerator, denominator] = amountString.split('/');

            return {
              amount: parseInt(numerator) / parseInt(denominator),
              unit,
              name,
            };
          } else {
            return { amount: parseInt(amountString), unit, name };
          }
        } catch {
          return { amount: 0, unit, name };
        }
      })
      .filter((product) => product.amount > 0);
  }

  private base64ToMulterFile(
    base64String: string,
    fileName: string,
  ): Express.Multer.File {
    const buffer = Buffer.from(base64String, 'base64');

    return {
      fieldname: 'file',
      originalname: fileName,
      encoding: '7bit',
      mimetype: 'image/*',
      size: buffer.length,
      buffer: buffer,
      destination: undefined,
      filename: undefined,
      path: undefined,
      stream: undefined,
    };
  }
}
