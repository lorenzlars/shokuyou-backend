import { Reflector } from '@nestjs/core';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  SetMetadata,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { plainToInstance } from 'class-transformer';

export const RESPONSE_DTO = 'responseDto';
export const TransformResponse = (dto: any) => SetMetadata(RESPONSE_DTO, dto);

/**
 * ResponseTransformInterceptor is a NestJS interceptor that transforms the response
 * data into a specified DTO (Data Transfer Object) class, if one is defined via metadata.
 */
@Injectable()
export class ResponseTransformInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const targetClass = this.reflector.get(RESPONSE_DTO, context.getHandler());

    if (!targetClass) {
      return next.handle();
    }

    return next.handle().pipe(
      map((data) =>
        plainToInstance(targetClass, data, {
          excludeExtraneousValues: true,
        }),
      ),
    );
  }
}
