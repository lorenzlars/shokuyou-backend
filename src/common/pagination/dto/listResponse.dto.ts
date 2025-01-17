import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { Expose } from 'class-transformer';

export abstract class ListResponseDto<T> {
  public abstract content: T[];

  @ApiProperty()
  @Expose()
  @IsNumber()
  public total: number;
}
