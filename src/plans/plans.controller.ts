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
import { PlanResponseSimpleDto } from './dto/planResponseSimple.dto';
import { ListResponseDto } from '../common/dto/listResponse.dto';
import { ApiListResponse } from '../common/decorators/apiListResponse';

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
    return this.plansService.create({
      ...planRequestDto,
      meals: planRequestDto.meals.map((meal) => ({
        ...meal,
        recipe: { id: meal.recipeId },
      })),
    });
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
  getPlan(@Param('id') id: string) {
    return this.plansService.findOne(id);
  }

  @ApiOperation({
    operationId: 'getPlans',
  })
  @ApiListResponse(PlanResponseSimpleDto)
  @TransformResponse(ListResponseDto<PlanResponseSimpleDto>)
  @Get()
  getPlans(): Promise<ListResponseDto<PlanResponseSimpleDto>> {
    return this.plansService.findAll();
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
