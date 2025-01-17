import { Expose, Type } from 'class-transformer';
import { PaginationResponseDto } from '../../common/pagination/dto/paginationResponse.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import { ProductResponseDto } from './productResponse.dto';

export class ProductPaginatedResponseDto extends PaginationResponseDto<ProductResponseDto> {
  @ApiProperty({
    isArray: true,
    type: ProductResponseDto,
  })
  @Expose()
  @IsArray()
  @Type(() => ProductResponseDto)
  public content: ProductResponseDto[];
}
