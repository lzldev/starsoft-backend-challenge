import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { UserPayload } from '../auth/user-payload.interface';

/**
 * Returns User from Request
 * Must be used in a authenticated Route
 * Example:
 ```typescript
 @Get()
 route(@ReqUser user: UserPayload){
 return user
 }
 ```
 */
export const ReqUser = createParamDecorator<UserPayload>(
  (_: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return request.user;
  },
);
