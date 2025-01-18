import {
  IsArray,
  IsNumber,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum AddProductRequestType {
  product = 'product',
  recipes = 'recipes',
}

interface AddProductRequest {
  type: AddProductRequestType.product;
  name: string;
  unit: string;
  amount: number;
}

interface AddRecipeRequest {
  type: AddProductRequestType.recipes;
  recipeIds: string[];
}

export class AddProductRequestDto implements AddProductRequest {
  @ApiProperty({
    enum: AddProductRequestType,
    default: AddProductRequestType.product,
    enumName: 'AddProductRequestType',
  })
  @IsString()
  type: AddProductRequestType.product;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  unit: string;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  amount: number;
}

export class AddRecipesRequestDto implements AddRecipeRequest {
  @ApiProperty({
    enum: AddProductRequestType,
    default: AddProductRequestType.recipes,
    enumName: 'AddProductRequestType',
  })
  @IsString()
  readonly type: AddProductRequestType.recipes;

  @ApiProperty({
    isArray: true,
  })
  @IsArray()
  @IsUUID('4', { each: true })
  recipeIds: string[];
}
