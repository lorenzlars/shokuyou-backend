import {
  IsArray,
  IsEnum,
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

export class AddProductBaseDto {
  @IsEnum(AddProductRequestType)
  type: AddProductRequestType;
}

export class AddProductRequestDto implements AddProductRequest {
  @ApiProperty({
    enum: AddProductRequestType,
    enumName: 'AddProductRequestType',
    default: AddProductRequestType.product,
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
    enumName: 'AddProductRequestType',
    default: AddProductRequestType.recipes,
  })
  @IsString()
  type: AddProductRequestType.recipes;

  @ApiProperty({
    isArray: true,
    type: String,
  })
  @IsArray()
  @IsUUID('4', { each: true })
  recipeIds: string[];
}
