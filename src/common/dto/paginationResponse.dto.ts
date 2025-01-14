import { ApiProperty } from '@nestjs/swagger';
import { PaginationRequestFilterQueryDto } from './paginationRequestFilterQuery.dto';
import { IsNumber } from 'class-validator';
import { Expose } from 'class-transformer';

export abstract class PaginationResponseDto<
  T,
> extends PaginationRequestFilterQueryDto {
  public abstract content: T[];

  @ApiProperty()
  @Expose()
  @IsNumber()
  public total: number;
}
