import {
  IsArray,
  IsNumber,
  IsObject,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class LogEntryDto {
  @ApiProperty({
    description: 'The i18n message key',
  })
  @IsString()
  @Expose()
  messageKey: string;

  @ApiPropertyOptional({
    description: 'The i18n message properties',
  })
  @IsOptional()
  @IsObject()
  @Expose()
  messageProperties?: Record<string, string>;
}

export class ProductResponseDto {
  @ApiProperty()
  @IsString()
  @Expose()
  id: string;

  @ApiProperty()
  @IsString()
  @Expose()
  name: string;

  @ApiProperty()
  @IsString()
  @Expose()
  unit: string;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  @Expose()
  amount: number;

  @ApiProperty({
    type: LogEntryDto,
    isArray: true,
  })
  @IsArray()
  @Type(() => LogEntryDto)
  @Expose()
  log: LogEntryDto[];
}
