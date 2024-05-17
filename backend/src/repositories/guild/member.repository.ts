// @ts-nocheck
import { ApplicationError } from '../../utils/error/applicationError';
import UserGuildRelation from '../../models/user/userGuildRelation.model';
import { UserModel } from '../../models/user/user.model';

class MemberRepository {
  static async getAll(guildId) {
    const relations = await UserGuildRelation.getAllByGuild(guildId);
    if (relations?.length) {
      const guildMembers = await Promise.all(
        relations.map(async ({ userId, membership }) => {
          const { id, name, imageUrl, rank } = await UserModel.getOneById(userId);
          return { id, name, imageUrl, rank, membership };
        })
      );
      return guildMembers;
    }
  }

  static async sendInvitation(recipientId, guildId) {
    const member = await UserGuildRelation.getOneByGuildAndUser(recipientId, guildId);
    if (member) throw new ApplicationError(409);
    const newMemberId = await UserGuildRelation.create(recipientId, guildId, 'Pending');
    if (!newMemberId) throw new ApplicationError(400);
  }

  static async replyInvitation(uid, guildId) {
    const member = await UserGuildRelation.getOneByGuildAndUser(uid, guildId);
    if (!member) throw new ApplicationError(409);
    if (member.membership !== 'Pending') throw new ApplicationError(409);

    const result = await UserGuildRelation.update(uid, guildId, 'Regular');
    if (!result) throw new ApplicationError(400);
  }

  static async update({ uid: targetUserId, gid: guildId }, membership) {
    const result = await UserGuildRelation.update(targetUserId, guildId, membership);
    if (!result) throw new ApplicationError(400);
  }

  static async delete({ uid: targetUserId, gid: guildId }, requester, membership) {
    const isMaster = membership === 'Master';
    const isCurrentUser = requester == targetUserId;
    if (isMaster && isCurrentUser) throw new ApplicationError(403);
    if (isMaster || isCurrentUser) {
      console.log(targetUserId, guildId);
      const result = await UserGuildRelation.delete(targetUserId, guildId);
      if (!result) throw new ApplicationError(400);
    } else throw new ApplicationError(403);
  }
}

export default MemberRepository;
