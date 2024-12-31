import { ApiProperty } from '@nestjs/swagger';

export class ResponseRecipeDto {
  @ApiProperty({
    description: 'Name of the recipe',
    example: 'Spaghetti Carbonara',
  })
  id: string;

  @ApiProperty({
    description: 'Name of the recipe',
    example: 'Spaghetti Carbonara',
  })
  name: string;

  @ApiProperty({
    description: 'Description of the recipe',
    example: 'A classic Italian pasta dish',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'The image url the recipe image',
    required: false,
  })
  imageUrl?: string;
}
