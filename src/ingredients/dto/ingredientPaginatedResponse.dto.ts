import { Expose, Type } from 'class-transformer';
import { PaginationResponseDto } from '../../common/pagination/dto/paginationResponse.dto';
import { IngredientResponseDto } from './ingredientResponse.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class IngredientPaginatedResponseDto extends PaginationResponseDto<IngredientResponseDto> {
  @ApiProperty({
    isArray: true,
    type: IngredientResponseDto,
  })
  @Expose()
  @IsArray()
  @Type(() => IngredientResponseDto)
  public content: IngredientResponseDto[];
}
