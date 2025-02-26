import {Request as ExpressRequest} from 'express';
import {AccessTokenPayload} from 'src/auth/types/access-token-payload';

export type Request = ExpressRequest & {
  accessTokenPayload?: AccessTokenPayload;
};
