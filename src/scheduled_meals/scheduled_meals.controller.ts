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
import { CreateScheduledMealDto } from './dto/create-scheduled_meal.dto';
import { UpdateScheduledMealDto } from './dto/update-scheduled_meal.dto';
import { ApiBearerAuth, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

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

  @Post()
  create(@Body() _createScheduledMealDto: CreateScheduledMealDto) {
    throw new NotImplementedException();
  }

  @Get()
  findAll() {
    throw new NotImplementedException();
  }

  @Get(':id')
  findOne(@Param('id') _id: string) {
    throw new NotImplementedException();
  }

  @Patch(':id')
  update(
    @Param('id') _id: string,
    @Body() _updateScheduledMealDto: UpdateScheduledMealDto,
  ) {
    throw new NotImplementedException();
  }

  @Delete(':id')
  remove(@Param('id') _id: string) {
    throw new NotImplementedException();
  }
}
