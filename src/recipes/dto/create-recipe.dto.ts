import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRecipeDto {
  @ApiProperty({ description: 'Name of the recipe' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Description of the recipe' })
  @IsString()
  description: string;

  // Füge weitere Eigenschaften mit @ApiProperty hinzu
} 
