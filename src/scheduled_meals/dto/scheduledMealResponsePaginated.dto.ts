import { Expose, Type } from 'class-transformer';
import { ListResponseDto } from '../../common/pagination/dto/listResponse.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import { ScheduledMealResponseDto } from './scheduledMealResponse.dto';

export class ScheduledMealResponsePaginatedDto extends ListResponseDto<ScheduledMealResponseDto> {
  @ApiProperty({
    isArray: true,
    type: ScheduledMealResponseDto,
  })
  @Expose()
  @IsArray()
  @Type(() => ScheduledMealResponseDto)
  public content: ScheduledMealResponseDto[];
}
