import { Expose, Type } from 'class-transformer';
import { PaginationResponseDto } from '../../common/pagination/dto/paginationResponse.dto';
import { RecipeResponseFlatDto } from './recipeResponseFlat.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class RecipePaginatedResponseDto extends PaginationResponseDto<RecipeResponseFlatDto> {
  @ApiProperty({
    isArray: true,
    type: RecipeResponseFlatDto,
  })
  @Expose()
  @IsArray()
  @Type(() => RecipeResponseFlatDto)
  public content: RecipeResponseFlatDto[];
}
