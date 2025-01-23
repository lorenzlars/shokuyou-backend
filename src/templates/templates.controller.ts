import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Put,
  Query,
} from '@nestjs/common';
import { TemplatesService } from './templates.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PlanRequestDto } from './dto/planRequest.dto';
import { TransformResponse } from '../common/interceptors/responseTransformInterceptor';
import { PlanResponseDto } from './dto/planResponse.dto';
import { CreatePlanDto } from './dto/createPlan.dto';
import { PlanResponsePaginatedSimpleDto } from './dto/planResponsePaginatedSimple.dto';
import { PaginationRequestFilterQueryDto } from '../common/pagination/dto/paginationRequestFilterQuery.dto';

@ApiTags('templates')
@ApiSecurity('access-token')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({
  path: 'templates',
  version: '1',
})
export class TemplatesController {
  constructor(private readonly plansService: TemplatesService) {}

  @ApiOperation({
    operationId: 'createPlan',
  })
  @ApiCreatedResponse({
    type: PlanResponseDto,
  })
  @ApiBody({
    type: CreatePlanDto,
  })
  @TransformResponse(PlanResponseDto)
  @Post()
  async createTemplate(@Body() createPlanDto: CreatePlanDto) {
    return await this.plansService.createTemplate(createPlanDto);
  }

  @ApiOperation({
    operationId: 'getTemplate',
  })
  @ApiOkResponse({
    type: PlanResponseDto,
  })
  @ApiNotFoundResponse()
  @TransformResponse(PlanResponseDto)
  @Get(':id')
  async getTemplate(@Param('id') id: string) {
    return await this.plansService.getTemplate(id);
  }

  @ApiOperation({
    operationId: 'getTemplates',
  })
  @ApiOkResponse({
    type: PlanResponsePaginatedSimpleDto,
  })
  @TransformResponse(PlanResponsePaginatedSimpleDto)
  @Get()
  async getTemplates(
    @Query() filter: PaginationRequestFilterQueryDto,
  ): Promise<PlanResponsePaginatedSimpleDto> {
    return await this.plansService.getTemplates(filter);
  }

  @ApiOperation({
    operationId: 'updateTemplate',
  })
  @ApiOkResponse({
    type: PlanResponseDto,
  })
  @ApiNotFoundResponse()
  @ApiBody({
    type: PlanRequestDto,
  })
  @TransformResponse(PlanResponseDto)
  @Put(':id')
  async updateTemplate(
    @Param('id') id: string,
    @Body() updatePlanDto: PlanRequestDto,
  ) {
    return await this.plansService.updateTemplate(id, updatePlanDto);
  }

  @ApiOperation({
    operationId: 'removeTemplate',
  })
  @ApiOkResponse()
  @ApiNotFoundResponse()
  @Delete(':id')
  async removeTemplate(@Param('id') id: string) {
    return await this.plansService.removeTemplate(id);
  }
}
