import { ApiProperty } from '@nestjs/swagger';
import { PaginationRequestFilterQueryDto } from './paginationRequestFilterQueryDto';
import { IsArray, IsNumber } from 'class-validator';
import { Expose } from 'class-transformer';

export class PaginationResponseDto<
  T extends object,
> extends PaginationRequestFilterQueryDto {
  // eslint-disable-next-line @darraghor/nestjs-typed/validated-non-primitive-property-needs-type-decorator
  @ApiProperty({
    description: 'The content of the page',
    isArray: true,
  })
  @Expose()
  @IsArray()
  public content: T[];

  @ApiProperty({
    description: 'The total number of items',
  })
  @Expose()
  @IsNumber()
  public total: number;
}
