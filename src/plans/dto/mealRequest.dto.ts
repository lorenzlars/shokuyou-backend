import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class MealRequestDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  dayIndex: number;

  // @ApiProperty()
  // @IsNumber()
  // @IsNotEmpty()
  // timeIndex: number;

  @ApiProperty()
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  recipeId: string;
}
