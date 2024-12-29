import { IsNumber, IsOptional, IsEnum, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class PaginationFilterDto {
  @ApiProperty({
    description: 'The page number',
    default: 1,
  })
  @Transform(({ value }) => parseInt(value))
  @Min(1)
  @IsNumber({}, { message: ' "page" atrribute should be a number' })
  public page: number = 1;

  @ApiProperty({
    description: 'The page size',
    default: 10,
  })
  @Transform(({ value }) => parseInt(value))
  @Min(1)
  @IsNumber({}, { message: ' "pageSize" attribute should be a number ' })
  public pageSize: number = 10;

  @ApiProperty({
    description: 'The order by attribute',
    required: false,
  })
  @IsOptional()
  public orderBy?: string;

  @ApiProperty({
    description: 'The sort order',
    required: false,
  })
  @IsEnum(SortOrder)
  @IsOptional()
  public sortOrder?: SortOrder = SortOrder.DESC;
}
