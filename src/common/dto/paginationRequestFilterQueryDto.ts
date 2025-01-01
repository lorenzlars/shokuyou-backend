import { IsEnum, IsNumber, IsOptional, Min } from 'class-validator';
import { Expose } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum PaginationSortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class PaginationRequestFilterQueryDto {
  @ApiProperty({
    description: 'The page number',
    default: 1,
  })
  @Min(1)
  @Expose()
  @IsNumber({}, { message: ' "page" atrribute should be a number' })
  public page: number = 1;

  @ApiProperty({
    description: 'The page size',
    default: 10,
  })
  @Min(1)
  @Expose()
  @IsNumber({}, { message: ' "pageSize" attribute should be a number ' })
  public pageSize: number = 10;

  @ApiPropertyOptional({
    description: 'The order by attribute',
    required: false,
  })
  @Expose()
  @IsOptional()
  public orderBy?: string;

  @ApiPropertyOptional({
    description: 'The sort order',
    enum: PaginationSortOrder,
    enumName: 'PaginationSortOrder',
  })
  @Expose()
  @IsOptional()
  @IsEnum(PaginationSortOrder)
  public sortOrder?: PaginationSortOrder = PaginationSortOrder.DESC;
}
