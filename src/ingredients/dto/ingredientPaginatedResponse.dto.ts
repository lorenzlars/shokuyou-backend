import { Expose, Type } from 'class-transformer';
import { PaginationResponseDto } from '../../common/pagination/dto/paginationResponse.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

class IngredientResponseDto {
  @ApiProperty()
  @IsString()
  @Expose()
  id: string;

  @ApiProperty()
  @IsString()
  @Expose()
  name: string;
}

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
