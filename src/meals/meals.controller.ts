import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Query,
  Put,
} from '@nestjs/common';
import { ScheduledMealsService } from './meals.service';
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
import { TransformResponse } from '../common/interceptors/responseTransformInterceptor';
import { ScheduledMealResponseDto } from './dto/scheduledMealResponse.dto';
import { ScheduledMealResponsePaginatedDto } from './dto/scheduledMealResponsePaginated.dto';
import { ScheduledMealRequestQueryDto } from './dto/scheduledMealRequestQuery.dto';
import { ScheduledMealRequestDto } from './dto/scheduledMealRequest.dto';

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
  async createScheduledMeal(
    @Body() createScheduledMealDto: ScheduledMealRequestDto,
  ): Promise<ScheduledMealResponseDto> {
    return await this.scheduledMealsService.createMeal(createScheduledMealDto);
  }

  @ApiOperation({
    operationId: 'getScheduledMeals',
  })
  @ApiQuery({
    type: ScheduledMealRequestQueryDto,
  })
  @ApiOkResponse({
    type: ScheduledMealResponsePaginatedDto,
  })
  @TransformResponse(ScheduledMealResponsePaginatedDto)
  @Get()
  async getScheduledMeals(
    @Query() filter: ScheduledMealRequestQueryDto,
  ): Promise<ScheduledMealResponsePaginatedDto> {
    return (await this.scheduledMealsService.getMeals(
      filter,
    )) as ScheduledMealResponsePaginatedDto;
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
  async getScheduledMeal(
    @Param('id') id: string,
  ): Promise<ScheduledMealResponseDto> {
    return await this.scheduledMealsService.getMeal(id);
  }

  @ApiOperation({
    operationId: 'updateScheduledMeal',
  })
  @ApiBody({
    type: ScheduledMealRequestDto,
  })
  @ApiOkResponse({
    type: ScheduledMealResponseDto,
  })
  @ApiNotFoundResponse()
  @TransformResponse(ScheduledMealResponseDto)
  @Put(':id')
  async updateScheduledMeal(
    @Param('id') id: string,
    @Body() updateScheduledMealDto: ScheduledMealRequestDto,
  ): Promise<ScheduledMealResponseDto> {
    return await this.scheduledMealsService.updateMeal(
      id,
      updateScheduledMealDto,
    );
  }

  @ApiOperation({
    operationId: 'deleteScheduledMeal',
  })
  @ApiOkResponse()
  @ApiNotFoundResponse()
  @TransformResponse(ScheduledMealResponseDto)
  @Delete(':id')
  async deleteScheduledMeal(@Param('id') id: string) {
    await this.scheduledMealsService.removeMeal(id);
  }
}
