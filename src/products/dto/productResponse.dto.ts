import {
  IsArray,
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { MessageType } from '../entities/productLog.entity';

export class LogEntryDto {
  @ApiProperty({
    description: 'The i18n message key',
    enum: MessageType,
    enumName: 'MessageType',
  })
  @IsEnum({ enum: MessageType })
  @Expose()
  messageType: MessageType;

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
