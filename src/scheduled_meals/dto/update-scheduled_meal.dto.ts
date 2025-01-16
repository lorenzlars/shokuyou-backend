import { PartialType } from '@nestjs/swagger';
import { CreateScheduledMealDto } from './create-scheduled_meal.dto';

export class UpdateScheduledMealDto extends PartialType(
  CreateScheduledMealDto,
) {}
