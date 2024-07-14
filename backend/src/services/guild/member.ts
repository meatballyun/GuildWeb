import { ApplicationError } from '../../utils/error/applicationError';
import { Membership } from '../../types/user/userGuildRelation';
import { UserGuildRelationModel } from '../../models';

export const getAll = async (guildId: number) => {
  const relations = await UserGuildRelationModel.getAllByGuildId(guildId);
  return relations;
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
