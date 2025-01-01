import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export type RequestUser = Record<string, any>;

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    return request.user;
  },
);
