import { ApiProperty } from '@nestjs/swagger';
import { PaginationFilterDto } from './pagination-filter.dto';

export class PaginationResponseDto<
  T extends object,
> extends PaginationFilterDto {
  @ApiProperty({
    description: 'The content of the page',
  })
  public content: T[];

  @ApiProperty({
    description: 'The total number of items',
  })
  public total: number;
}
