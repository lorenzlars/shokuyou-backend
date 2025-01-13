import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  NotImplementedException,
  Put,
  Query,
} from '@nestjs/common';
import { PlansService } from './plans.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PlanRequestDto } from './dto/planRequest.dto';
import { TransformResponse } from '../common/interceptors/responseTransformInterceptor';
import { PlanResponseDto } from './dto/planResponse.dto';
import { ApiPaginatedResponse } from '../common/decorators/apiPaginationResponse';
import { PaginationRequestFilterQueryDto } from '../common/dto/paginationRequestFilterQueryDto';
import { PaginationResponseDto } from '../common/dto/paginationResponse.dto';

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
    type: PlanRequestDto,
  })
  @TransformResponse(PlanResponseDto)
  @Post()
  createPlan(@Body() planRequestDto: PlanRequestDto) {
    return this.plansService.create(planRequestDto);
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
  getPlan(@Param('id') _id: string) {
    throw new NotImplementedException();
  }

  @ApiOperation({
    operationId: 'getPlans',
  })
  @ApiPaginatedResponse(PlanResponseDto)
  @ApiQuery({
    type: PaginationRequestFilterQueryDto,
  })
  @TransformResponse(PaginationResponseDto<PlanResponseDto>)
  @Get()
  getPlans(@Query() filter: PaginationRequestFilterQueryDto) {
    return this.plansService.findAll(filter);
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
  updatePlan(@Param('id') _id: string, @Body() _updatePlanDto: PlanRequestDto) {
    throw new NotImplementedException();
  }

  @ApiOperation({
    operationId: 'removePlan',
  })
  @ApiOkResponse()
  @ApiNotFoundResponse()
  @Delete(':id')
  removePlan(@Param('id') _id: string) {
    throw new NotImplementedException();
  }
}
