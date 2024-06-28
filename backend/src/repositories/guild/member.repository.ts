import { ApplicationError } from '../../utils/error/applicationError';
import { UserGuildRelationModel } from '../../models/user/userGuildRelation.model';
import { UserModel } from '../../models/user/user.model';
import { User } from '../../types/user/user';
import { Membership } from '../../types/user/userGuildRelation';

class MemberRepository {
  static async getAll(guildId: number) {
    const relations = await UserGuildRelationModel.getAllByGuild(guildId);
    if (relations?.length) {
      const guildMembers = await Promise.all(
        relations.map(async ({ userId, membership }) => {
          const { id, name, imageUrl, rank } = (await UserModel.getOneById(userId)) as User;
          return { id, name, imageUrl, rank, membership };
        })
      );
      return guildMembers;
    }
  }

  static async sendInvitation(recipientId: number, guildId: number) {
    const member = await UserGuildRelationModel.getOneByGuildAndUser(recipientId, guildId);
    if (member) throw new ApplicationError(409);
    const newMemberId = await UserGuildRelationModel.create(recipientId, guildId, 'pending');
    if (!newMemberId) throw new ApplicationError(400);
  }

  static async replyInvitation(uid: number, guildId: number) {
    const member = await UserGuildRelationModel.getOneByGuildAndUser(uid, guildId);
    if (!member) throw new ApplicationError(409);
    if (member.membership !== 'pending') throw new ApplicationError(409);

    const result = await UserGuildRelationModel.update(uid, guildId, 'regular');
    if (!result) throw new ApplicationError(400);
  }

  static async update({ uid: targetUserId, gid: guildId }: { uid: number; gid: number }, membership: Membership) {
    const result = await UserGuildRelationModel.update(targetUserId, guildId, membership);
    if (!result) throw new ApplicationError(400);
  }

  static async delete({ uid: targetUserId, gid: guildId }: { uid: number; gid: number }, requesterId: number, membership: Membership) {
    const isMaster = membership === 'master';
    const isCurrentUser = requesterId == targetUserId;
    if (isMaster && isCurrentUser) throw new ApplicationError(403);
    if (isMaster || isCurrentUser) {
      const result = await UserGuildRelationModel.delete(targetUserId, guildId);
      if (!result) throw new ApplicationError(400);
    } else throw new ApplicationError(403);
  }
}

export default MemberRepository;
