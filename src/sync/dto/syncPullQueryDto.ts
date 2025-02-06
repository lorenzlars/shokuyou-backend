import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class SyncPullQueryDto {
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Expose()
  last_pulled_at?: number;

  @ApiProperty()
  @IsNumber()
  @Expose()
  schema_version: number;

  @ApiProperty()
  @IsString()
  @Expose()
  migration: string;
}
