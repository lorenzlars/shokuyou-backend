import {  IsNotEmpty, IsString } from 'class-validator';

export class UpdateRecipeDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;
}