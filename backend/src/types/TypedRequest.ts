import { Query, Params } from 'express-serve-static-core';
import { Session } from 'express-session';
import { Request } from 'express';
import { Membership } from './user/userGuildRelation';

type Passport = {
  user: number;
};

interface Sess extends Session {
  passport: Passport;
}

interface Member {
  membership: Membership;
}

export interface TypedRequest<D = any, Q extends Query = any, P = any> extends Omit<Request, 'params'> {
  body: D;
  query: Q;
  params: P;
  session: Sess;
  member?: Member;
}
