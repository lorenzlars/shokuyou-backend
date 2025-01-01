import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Interceptor to remove all properties with value null or undefined from the outgoing object
 */
@Injectable()
export class RemoveEmptyInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (data && typeof data === 'object') {
          return this.removeNullFields(data);
        }
        return data;
      }),
    );
  }

  private removeNullFields(obj: any) {
    return Object.entries(obj).reduce((acc, [key, val]) => {
      if (val !== null && val !== undefined) {
        acc[key] =
          typeof val === 'object' && !Array.isArray(val)
            ? this.removeNullFields(val)
            : val;
      }
      return acc;
    }, {});
  }
}
