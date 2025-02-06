import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  NotImplementedException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TransformResponse } from '../common/interceptors/responseTransformInterceptor';
import { SyncResponseDto } from './dto/syncResponse.dto';
import { SyncRequestDto } from './dto/syncRequest.dto';
import { SyncService } from './sync.service';

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
  @ApiCreatedResponse({
    type: SyncResponseDto,
  })
  @TransformResponse(SyncResponseDto)
  @Post()
  async syncPush(
    @Body() _syncRequestDto: SyncRequestDto,
  ): Promise<SyncResponseDto> {
    throw new NotImplementedException();
  }

  @ApiOperation({
    operationId: 'syncPull',
  })
  @ApiOkResponse({
    type: SyncResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Recipe not found',
  })
  @TransformResponse(SyncResponseDto)
  @Get()
  async syncPull(): Promise<SyncResponseDto> {
    throw new NotImplementedException();
  }
}
