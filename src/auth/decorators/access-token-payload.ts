import {createParamDecorator, ExecutionContext} from '@nestjs/common';
import {Request} from 'src/shared/types/request';
import {AccessTokenPayload} from '../types/access-token-payload';

export const GetAccessTokenPayload = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): AccessTokenPayload => {
    const request: Request = ctx.switchToHttp().getRequest();
    return request.accessTokenPayload as AccessTokenPayload;
  }
);
