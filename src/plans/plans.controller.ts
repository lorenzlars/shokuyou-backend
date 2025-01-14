import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Put,
} from '@nestjs/common';
import { PlansService } from './plans.service';
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

@ApiTags('plans')
@ApiSecurity('access-token')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({
  path: 'plans',
  version: '1',
})
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

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
  async createPlan(@Body() createPlanDto: CreatePlanDto) {
    return await this.plansService.create(createPlanDto);
  }

  @ApiOperation({
    operationId: 'getPlan',
  })
  @ApiOkResponse({
    type: PlanResponseDto,
  })
  @ApiNotFoundResponse()
  @TransformResponse(PlanResponseDto)
  @Get(':id')
  async getPlan(@Param('id') id: string) {
    return await this.plansService.findOne(id);
  }

  @ApiOperation({
    operationId: 'getPlans',
  })
  @ApiOkResponse({
    type: PlanResponsePaginatedSimpleDto,
  })
  @TransformResponse(PlanResponsePaginatedSimpleDto)
  @Get()
  async getPlans(): Promise<PlanResponsePaginatedSimpleDto> {
    return await this.plansService.findAll();
  }

  @ApiOperation({
    operationId: 'updatePlan',
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
  async updatePlan(
    @Param('id') id: string,
    @Body() updatePlanDto: PlanRequestDto,
  ) {
    return await this.plansService.update(id, updatePlanDto);
  }

  @ApiOperation({
    operationId: 'removePlan',
  })
  @ApiOkResponse()
  @ApiNotFoundResponse()
  @Delete(':id')
  async removePlan(@Param('id') id: string) {
    return await this.plansService.remove(id);
  }
}
