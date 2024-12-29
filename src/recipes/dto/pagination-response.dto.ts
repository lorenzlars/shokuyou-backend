import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from './pagination.dto';

export class PaginationResponseDto<T extends object> extends PaginationDto {
  @ApiProperty({
    description: 'The content of the page',
  })
  public content: T[];

  @ApiProperty({
    description: 'The total number of items',
  })
  public total: number;
}
