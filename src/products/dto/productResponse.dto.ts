import { IsNumber, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ProductResponseDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  unit: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  amount: number;
}
