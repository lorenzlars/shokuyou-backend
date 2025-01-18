import { IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ProductResponseDto } from './productResponse.dto';

export class AddProductsResponseDto {
  @ApiProperty({
    isArray: true,
    type: ProductResponseDto,
  })
  @IsArray()
  @Type(() => ProductResponseDto)
  @Expose()
  public products: ProductResponseDto[];
}
