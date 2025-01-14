import { Expose, Type } from 'class-transformer';
import { ListResponseDto } from '../../common/dto/listResponse.dto';
import { PlanResponseFlatDto } from './planResponseFlat.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class PlanResponsePaginatedSimpleDto extends ListResponseDto<PlanResponseFlatDto> {
  @ApiProperty({
    isArray: true,
    type: PlanResponseFlatDto,
  })
  @Expose()
  @IsArray()
  @Type(() => PlanResponseFlatDto)
  public content: PlanResponseFlatDto[];
}
