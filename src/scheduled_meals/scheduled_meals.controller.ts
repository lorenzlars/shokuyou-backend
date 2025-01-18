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
import { ScheduledMealRequestDto } from './dto/scheduledMealRequest.dto';
import { ScheduledMealResponseDto } from './dto/scheduledMealResponse.dto';
import { UpdateScheduledMealRequestDto } from './dto/updateScheduledMealRequest.dto';
import { ScheduledMealResponsePaginatedDto } from './dto/scheduledMealResponsePaginated.dto';

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
    type: ScheduledMealRequestDto,
  })
  @ApiCreatedResponse({
    type: ScheduledMealResponseDto,
  })
  @TransformResponse(ScheduledMealResponseDto)
  @Post()
  create(
    @Body() _createScheduledMealDto: ScheduledMealRequestDto,
  ): Promise<ScheduledMealResponseDto> {
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
  findAll(): Promise<ScheduledMealResponsePaginatedDto> {
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
  findOne(@Param('id') _id: string): Promise<ScheduledMealResponseDto> {
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
  update(
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
  remove(@Param('id') _id: string) {
    throw new NotImplementedException();
  }
}
