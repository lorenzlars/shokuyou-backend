import { IsNotEmpty, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class UpdateRecipeDto {
  @ApiProperty({
    description: 'The name of the recipe',
    example: 'Spaghetti Carbonara',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Der eindeutige Benutzername',
    example: 'johndoe',
    required: false,
  })
  @IsString()
  description?: string;
}
