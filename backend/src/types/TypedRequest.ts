import { Query, Params } from 'express-serve-static-core';
import { Request } from 'express';
import { Membership } from './user/userGuildRelation';

interface Member {
  membership: Membership;
}

export interface TypedRequest<D = any, Q extends Query = any, P = any> extends Omit<Request, 'params'> {
  body: D;
  query: Q;
  params: P;
  userId?: number;
  member?: Member;
}
