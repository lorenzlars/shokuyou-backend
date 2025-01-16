import * as cheerio from 'cheerio';
import { Injectable, Logger } from '@nestjs/common';
import { FetchError } from './FetchError';
import { Recipe } from '../recipes/recipes.service';

export interface Root {
  '@context': string;
  mainEntityOfPage: MainEntityOfPage;
  headline: string;
  description: string;
  '@type': string;
  datePublished: string;
  dateModified: string;
  isAccessibleForFree: boolean;
  publisher: Publisher;
  author: Author[];
  name: string;
  prepTime: string;
  cookTime: string;
  totalTime: string;
  recipeCategory: string;
  keywords: string;
  recipeYield: string;
  nutrition: Nutrition;
  recipeIngredient: string[];
  recipeInstructions: RecipeInstruction[];
  aggregateRating: AggregateRating;
  image: Image[];
}

export interface MainEntityOfPage {
  '@type': string;
  '@id': string;
}

export interface Publisher {
  '@type': string;
  name: string;
  logo: Logo;
}

export interface Logo {
  '@type': string;
  url: string;
}

export interface Author {
  '@type': string;
  name: string;
  url: string;
}

export interface Nutrition {
  '@type': string;
  servingSize: string;
  calories: string;
  fatContent: string;
  carbohydrateContent: string;
  proteinContent: string;
}

export interface RecipeInstruction {
  '@type': string;
  name: string;
  text: string;
  url: string;
}

export interface AggregateRating {
  '@type': string;
  ratingValue: number;
  ratingCount: number;
  worstRating: number;
  bestRating: number;
}

export interface Image {
  '@type': string;
  url: string;
  width: number;
  height: number;
}

@Injectable()
export class ImportRecipeService {
  private readonly logger = new Logger(ImportRecipeService.name);

  async scrapRecipe(url: string): Promise<Recipe & { imageUrl: string }> {
    const websiteData = await this.extractRecipe(url);

    return {
      name: websiteData.name,
      description: websiteData.description,
      imageUrl: websiteData.image[0].url,
      ingredients: websiteData.recipeIngredient.map((ingredient) => {
        const [_, amount, unit, name] =
          ingredient.match(/(\d+)\s*(\w+)?\s*(.+)/) || [];

        return {
          name,
          unit,
          amount: parseInt(amount),
        };
      }),
      instructions: websiteData.recipeInstructions
        .map((step) => step.text)
        .join('\n'),
    };
  }

  private async extractRecipe(url: string): Promise<Root> {
    try {
      const req = await fetch(url);
      const html = await req.text();
      const cheerioAPI = cheerio.load(html);

      // Check for JSON-LD scripts
      const jsonLdTags = cheerioAPI('script[type="application/ld+json"]');
      let recipeData = null;

      jsonLdTags.each((_, script) => {
        const content = cheerioAPI(script).html();
        try {
          const jsonData = JSON.parse(content);

          // Check if the JSON data matches the recipe schema
          if (Array.isArray(jsonData)) {
            jsonData.forEach((item) => {
              if (item['@type'] === 'Recipe') {
                recipeData = item;
              }
            });
          } else if (jsonData['@type'] === 'Recipe') {
            recipeData = jsonData;
          }
        } catch (err) {
          console.error('Failed to parse JSON-LD:', err.message);
        }
      });

      // If no JSON-LD recipe is found, look for Microdata
      if (!recipeData) {
        const microdata = cheerioAPI('[itemtype="http://schema.org/Recipe"]');

        if (microdata.length > 0) {
          recipeData = {};

          // Extract key details from the Microdata items
          microdata.find('[itemprop]').each((_, element) => {
            const key = cheerioAPI(element).attr('itemprop');
            const value = cheerioAPI(element).text().trim();
            recipeData[key] = value;
          });
        }
      }

      // Return the extracted recipe data if found
      if (recipeData) {
        return recipeData;
      }
      // TODO: ML pointer network could be used to transform html to json recipe schema
      this.logger.warn('No recipe data found on the website.');
      throw new Error('No recipe data found on the website.');
    } catch (error) {
      throw new FetchError(error.message);
    }
  }
}
