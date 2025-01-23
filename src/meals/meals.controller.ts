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
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TransformResponse } from '../common/interceptors/responseTransformInterceptor';
import { ScheduledMealResponseDto } from './dto/scheduledMealResponse.dto';
import { ScheduledMealResponsePaginatedDto } from './dto/scheduledMealResponsePaginated.dto';
import { ScheduledMealRequestQueryDto } from './dto/scheduledMealRequestQuery.dto';
import { ScheduledMealRequestDto } from './dto/scheduledMealRequest.dto';

@ApiTags('meals')
@ApiSecurity('access-token')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({
  path: 'meals',
  version: '1',
})
export class ScheduledMealsController {
  constructor(private readonly scheduledMealsService: ScheduledMealsService) {}

  @ApiOperation({
    operationId: 'createMeal',
  })
  @ApiBody({
    type: ScheduledMealRequestDto,
  })
  @ApiCreatedResponse({
    type: ScheduledMealResponseDto,
  })
  @TransformResponse(ScheduledMealResponseDto)
  @Post()
  async createMeal(
    @Body() createScheduledMealDto: ScheduledMealRequestDto,
  ): Promise<ScheduledMealResponseDto> {
    return await this.scheduledMealsService.createMeal(createScheduledMealDto);
  }

  @ApiOperation({
    operationId: 'getMeals',
  })
  @ApiOkResponse({
    type: ScheduledMealResponsePaginatedDto,
  })
  @TransformResponse(ScheduledMealResponsePaginatedDto)
  @Get()
  async getMeals(
    @Query() filter: ScheduledMealRequestQueryDto,
  ): Promise<ScheduledMealResponsePaginatedDto> {
    return (await this.scheduledMealsService.getMeals(
      filter,
    )) as ScheduledMealResponsePaginatedDto;
  }

  @ApiOperation({
    operationId: 'getMeal',
  })
  @ApiOkResponse({
    type: ScheduledMealResponseDto,
  })
  @ApiNotFoundResponse()
  @TransformResponse(ScheduledMealResponseDto)
  @Get(':id')
  async getMeal(@Param('id') id: string): Promise<ScheduledMealResponseDto> {
    return await this.scheduledMealsService.getMeal(id);
  }

  @ApiOperation({
    operationId: 'updateMeal',
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
  async updateMeal(
    @Param('id') id: string,
    @Body() updateScheduledMealDto: ScheduledMealRequestDto,
  ): Promise<ScheduledMealResponseDto> {
    return await this.scheduledMealsService.updateMeal(
      id,
      updateScheduledMealDto,
    );
  }

  @ApiOperation({
    operationId: 'deleteMeal',
  })
  @ApiOkResponse()
  @ApiNotFoundResponse()
  @TransformResponse(ScheduledMealResponseDto)
  @Delete(':id')
  async deleteMeal(@Param('id') id: string) {
    await this.scheduledMealsService.removeMeal(id);
  }
}
