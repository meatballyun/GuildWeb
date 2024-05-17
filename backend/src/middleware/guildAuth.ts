// @ts-nocheck
import UserGuildRelation from '../models/user/userGuildRelation.model';
import { ApplicationError } from '../utils/error/applicationError';

const checkAuth = async (user, gid, level) => {
  const member = await UserGuildRelation.getOneByGuildAndUser(user, gid);
  const message = (() => {
    if (!member && level >= 0)
      return 'You are not a member of this guild, or you have not been invited.';
    if (member.membership !== 'Vice' && member.membership !== 'Master' && level >= 1)
      return 'Only guild Master and Vice have permission to access this resource.';
    if (member.membership !== 'Master' && level >= 2)
      return 'Only guild Master have permission to access this resource.';
    return 'OK';
  })();

  return { message, member };
};

class GuildAuth {
  static async isMember(req, res, next) {
    const { message, member } = await checkAuth(req.session.passport.user, req.params.gid, 0);
    if (message === 'OK') {
      req.member = member;
      next();
    } else throw new ApplicationError(403, message);
  }

  static async isMasterOrVice(req, res, next) {
    const { message, member } = await checkAuth(req.session.passport.user, req.params.gid, 1);
    if (message === 'OK') {
      req.member = member;
      return next();
    } else throw new ApplicationError(403, message);
  }

  static async isMaster(req, res, next) {
    const { message, member } = await checkAuth(req.session.passport.user, req.params.gid, 2);
    if (message === 'OK') {
      req.member = member;
      return next();
    } else throw new ApplicationError(403, message);
  }
}

export default GuildAuth;
