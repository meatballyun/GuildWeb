import { ApplicationError } from '../../utils/error/applicationError';
import { User } from '../../types/user/user';
import { Membership } from '../../types/user/userGuildRelation';
import { UserModel, UserGuildRelationModel } from '../../models';

export const getAll = async (guildId: number) => {
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
};

export const sendInvitation = async (recipientId: number, guildId: number) => {
  const member = await UserGuildRelationModel.getOneByGuildAndUser(recipientId, guildId);
  if (member) throw new ApplicationError(409);
  const newMemberId = await UserGuildRelationModel.create(recipientId, guildId, 'pending');
  if (!newMemberId) throw new ApplicationError(400);
};

export const replyInvitation = async (uid: number, guildId: number) => {
  const member = await UserGuildRelationModel.getOneByGuildAndUser(uid, guildId);
  if (!member) throw new ApplicationError(409);
  if (member.membership !== 'pending') throw new ApplicationError(409);

  const result = await UserGuildRelationModel.update(uid, guildId, 'regular');
  if (!result) throw new ApplicationError(400);
};

export const update = async ({ uid: targetUserId, gid: guildId }: { uid: number; gid: number }, membership: Membership) => {
  const result = await UserGuildRelationModel.update(targetUserId, guildId, membership);
  if (!result) throw new ApplicationError(400);
};

export const remove = async ({ uid: targetUserId, gid: guildId }: { uid: number; gid: number }, requesterId: number, membership: Membership) => {
  const isMaster = membership === 'master';
  const isCurrentUser = requesterId == targetUserId;
  if (isMaster && isCurrentUser) throw new ApplicationError(403);
  if (isMaster || isCurrentUser) {
    const result = await UserGuildRelationModel.delete(targetUserId, guildId);
    if (!result) throw new ApplicationError(400);
  } else throw new ApplicationError(403);
};
