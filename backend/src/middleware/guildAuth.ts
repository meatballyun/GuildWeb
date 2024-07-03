import { Response, NextFunction } from 'express';
import { TypedRequest } from '../types/TypedRequest';
import { ApplicationError } from '../utils/error/applicationError';
import { UserGuildRelationModel } from '../models/user/userGuildRelation';

const checkAuth = async (uid: number, gid: number, level: number) => {
  const member = await UserGuildRelationModel.getOneByGuildAndUser(uid, gid);
  if (!member?.membership) throw new ApplicationError(401);
  const message = (() => {
    if (!member && level >= 0) return 'You are not a member of this guild, or you have not been invited.';
    if (member.membership !== 'vice' && member.membership !== 'master' && level >= 1) return 'Only guild Master and Vice have permission to access this resource.';
    if (member.membership !== 'master' && level >= 2) return 'Only guild Master have permission to access this resource.';
    return 'OK';
  })();

  return { message, member };
};

export class GuildAuth {
  static async isMember(req: TypedRequest<any, any, any>, res: Response, next: NextFunction) {
    const { message, member } = await checkAuth(req.userId as number, req.params.gid, 0);
    if (message === 'OK') {
      req.member = member;
      next();
    } else throw new ApplicationError(403, message);
  }

  static async isMasterOrVice(req: TypedRequest<any, any, any>, res: Response, next: NextFunction) {
    const { message, member } = await checkAuth(req.userId as number, req.params.gid, 1);
    if (message === 'OK') {
      req.member = member;
      return next();
    } else throw new ApplicationError(403, message);
  }

  static async isMaster(req: TypedRequest<any, any, any>, res: Response, next: NextFunction) {
    const { message, member } = await checkAuth(req.userId as number, req.params.gid, 2);
    if (message === 'OK') {
      req.member = member;
      return next();
    } else throw new ApplicationError(403, message);
  }
}
