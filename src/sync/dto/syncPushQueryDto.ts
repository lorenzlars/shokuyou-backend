import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { Expose } from 'class-transformer';

export class SyncPushQueryDto {
  @ApiProperty()
  @IsNumber()
  @Expose()
  last_pulled_at: number;
}
