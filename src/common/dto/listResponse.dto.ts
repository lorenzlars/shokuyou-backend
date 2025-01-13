import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber } from 'class-validator';
import { Expose } from 'class-transformer';

export class ListResponseDto<T> {
  // eslint-disable-next-line @darraghor/nestjs-typed/validated-non-primitive-property-needs-type-decorator
  @ApiProperty({
    isArray: true,
  })
  @Expose()
  @IsArray()
  public content: T[];

  @ApiProperty()
  @Expose()
  @IsNumber()
  public total: number;
}
