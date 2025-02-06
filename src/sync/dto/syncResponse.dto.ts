import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsObject } from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { RecipeResponseDto } from '../../recipes/dto/recipeResponse.dto';

class SyncDataDto<T> {
  @ApiProperty({
    isArray: true,
    type: Object,
  })
  @Type(() => Object)
  @IsArray()
  @Expose()
  created: T[];

  @ApiProperty({
    isArray: true,
    type: Object,
  })
  @Type(() => Object)
  @IsArray()
  @Expose()
  updated: T[];

  @ApiProperty({
    type: String,
    isArray: true,
  })
  @IsArray()
  @Expose()
  deleted: string[];
}

export class SyncResponseDto {
  @ApiProperty({
    type: SyncDataDto<RecipeResponseDto>,
  })
  @IsObject()
  @Type(() => SyncDataDto<RecipeResponseDto>)
  @Expose()
  recipes: SyncDataDto<RecipeResponseDto>;
}
