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
  create(@Body() _planRequestDto: PlanRequestDto) {
    throw new NotImplementedException();
  }

  @ApiOkResponse({
    type: PlanResponseDto,
  })
  @ApiNotFoundResponse()
  @TransformResponse(PlanResponseDto)
  @Get(':id')
  findOne(@Param('id') _id: string) {
    throw new NotImplementedException();
  }

  @ApiOkResponse({
    type: PlanResponseDto,
  })
  @ApiNotFoundResponse()
  @ApiBody({
    type: PlanRequestDto,
  })
  @TransformResponse(PlanResponseDto)
  @Put(':id')
  update(@Param('id') _id: string, @Body() _updatePlanDto: PlanRequestDto) {
    throw new NotImplementedException();
  }

  @ApiOkResponse()
  @ApiNotFoundResponse()
  @Delete(':id')
  remove(@Param('id') _id: string) {
    throw new NotImplementedException();
  }
}
