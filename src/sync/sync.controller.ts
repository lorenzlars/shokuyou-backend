import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  NotImplementedException,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TransformResponse } from '../common/interceptors/responseTransformInterceptor';
import { SyncPullResponseDto } from './dto/syncPullResponseDto';
import { SyncPullQueryDto } from './dto/syncPullQueryDto';
import { SyncService } from './sync.service';
import { SyncPushRequestDto } from './dto/syncPushRequestDto';
import { SyncPushQueryDto } from './dto/syncPushQueryDto';

@ApiTags('sync')
@ApiSecurity('access-token')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({
  path: 'sync',
  version: '1',
})
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  @ApiOperation({
    operationId: 'syncPush',
  })
  @ApiOkResponse()
  @Post()
  async syncPush(
    @Query() _syncPushQueryDto: SyncPushQueryDto,
    @Body() _syncPushRequestDto: SyncPushRequestDto,
  ) {
    throw new NotImplementedException();
  }

  @ApiOperation({
    operationId: 'syncPull',
  })
  @ApiOkResponse({
    type: SyncPullResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Recipe not found',
  })
  @TransformResponse(SyncPullResponseDto)
  @Get()
  async syncPull(
    @Query() _syncPullQueryDto: SyncPullQueryDto,
  ): Promise<SyncPullResponseDto> {
    throw new NotImplementedException();
  }
}
