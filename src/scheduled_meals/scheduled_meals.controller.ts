import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotImplementedException,
  UseGuards,
} from '@nestjs/common';
import { ScheduledMealsService } from './scheduled_meals.service';
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
import { TransformResponse } from '../common/interceptors/responseTransformInterceptor';
import { ScheduledMealResponseDto } from './dto/scheduledMealResponse.dto';
import { UpdateScheduledMealRequestDto } from './dto/updateScheduledMealRequest.dto';
import { ScheduledMealResponsePaginatedDto } from './dto/scheduledMealResponsePaginated.dto';
import { CreateScheduledMealsRequestDto } from './dto/createScheduledMealsRequest.dto';
import { CreateScheduledMealsResponseDto } from './dto/createScheduledMealsResponse.dto';

@ApiTags('scheduled-meals')
@ApiSecurity('access-token')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({
  path: 'scheduled-meals',
  version: '1',
})
export class ScheduledMealsController {
  constructor(private readonly scheduledMealsService: ScheduledMealsService) {}

  @ApiOperation({
    operationId: 'createScheduledMeal',
  })
  @ApiBody({
    type: CreateScheduledMealsRequestDto,
  })
  @ApiCreatedResponse({
    type: CreateScheduledMealsResponseDto,
  })
  @TransformResponse(CreateScheduledMealsResponseDto)
  @Post()
  createScheduledMeal(
    @Body() _createScheduledMealDto: CreateScheduledMealsRequestDto,
  ): Promise<CreateScheduledMealsResponseDto> {
    throw new NotImplementedException();
  }

  @ApiOperation({
    operationId: 'getScheduledMeals',
  })
  @ApiOkResponse({
    type: ScheduledMealResponsePaginatedDto,
  })
  @TransformResponse(ScheduledMealResponsePaginatedDto)
  @Get()
  getScheduledMeals(): Promise<ScheduledMealResponsePaginatedDto> {
    throw new NotImplementedException();
  }

  @ApiOperation({
    operationId: 'getScheduledMeal',
  })
  @ApiOkResponse({
    type: ScheduledMealResponseDto,
  })
  @ApiNotFoundResponse()
  @TransformResponse(ScheduledMealResponseDto)
  @Get(':id')
  getScheduledMeal(
    @Param('id') _id: string,
  ): Promise<ScheduledMealResponseDto> {
    throw new NotImplementedException();
  }

  @ApiOperation({
    operationId: 'updateScheduledMeal',
  })
  @ApiBody({
    type: UpdateScheduledMealRequestDto,
  })
  @ApiOkResponse({
    type: ScheduledMealResponseDto,
  })
  @ApiNotFoundResponse()
  @TransformResponse(ScheduledMealResponseDto)
  @Patch(':id')
  updateScheduledMeal(
    @Param('id') _id: string,
    @Body() _updateScheduledMealDto: UpdateScheduledMealRequestDto,
  ): Promise<ScheduledMealResponseDto> {
    throw new NotImplementedException();
  }

  @ApiOperation({
    operationId: 'deleteScheduledMeal',
  })
  @ApiOkResponse()
  @ApiNotFoundResponse()
  @TransformResponse(ScheduledMealResponseDto)
  @Delete(':id')
  deleteScheduledMeal(@Param('id') _id: string) {
    throw new NotImplementedException();
  }
}
