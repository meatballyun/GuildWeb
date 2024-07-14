import { ApplicationError } from '../../utils/error/applicationError';
import { timeHandle, formatTimestamp } from '../../utils/timeHandler';
import { User } from '../../types/user/user';
import { Membership } from '../../types/user/userGuildRelation';
import { MissionTemplateInfo, MissionTemplateTime } from '../../types/guild/missionTemplate';
import { Item } from './missionTemplateItem';
import { UserModel, MissionTemplateModel, MissionTemplateItemModel } from '../../models';
import * as missionTemplateItemService from './missionTemplateItem';

interface MissionTemplateDetailed extends MissionTemplateTime, MissionTemplateInfo {
  items: Item[];
}

export const getAll = async (guildId: number, query?: string) => {
  const missionTemplates = query ? await MissionTemplateModel.getAllByGuildAndName(guildId, query) : await MissionTemplateModel.getAllByGuild(guildId);
  if (missionTemplates?.length) {
    const data = await Promise.all(
      missionTemplates.map(async ({ id, enabled, creator, name, type }) => {
        return { id, enabled, creator, name, type };
      })
    );
    return data;
  }
};

export const getOne = async (missionTemplateId: number) => {
  const missionTemplate = await MissionTemplateModel.getOne(missionTemplateId);
  if (missionTemplate) {
    const { id, name, imageUrl } = (await UserModel.getOneById(missionTemplate.creatorId)) as User;
    if (!id) throw new ApplicationError(409);
    const items = await missionTemplateItemService.getAll(missionTemplateId);
    return {
      creator: { id, name, imageUrl },
      ...missionTemplate,
      items,
    };
  } else throw new ApplicationError(404);
};

export const create = async ({ generationTime, deadline, items, ...otherData }: MissionTemplateDetailed, guildId: number, uid: number) => {
  let time = await timeHandle(generationTime, deadline);
  const newTemplateId = await MissionTemplateModel.create(uid, guildId, time, otherData);
  if (!newTemplateId) throw new ApplicationError(400);

  await missionTemplateItemService.create(items, newTemplateId);
  return { id: newTemplateId };
};

export const update = async ({ generationTime, deadline, items, ...otherData }: MissionTemplateDetailed, missionTemplateId: number, membership: Membership, uid: number) => {
  const missionTemplate = await MissionTemplateModel.getOne(missionTemplateId);
  if (!missionTemplate) throw new ApplicationError(404);
  if (membership === 'vice' && uid !== missionTemplate.creatorId) throw new ApplicationError(403);
  if (generationTime > deadline) throw new ApplicationError(409);

  const time = { generationTime: formatTimestamp(generationTime), deadline: formatTimestamp(deadline) };
  const result = await MissionTemplateModel.update(missionTemplateId, time, otherData);
  if (!result) throw new ApplicationError(400);

  const templateItems: { id: number; content: string }[] = [];
  const newContents: string[] = [];
  const deleteIds: number[] = [];
  if (items) {
    items.map(({ id, content }) => {
      if (content) {
        id ? templateItems.push({ id, content }) : newContents.push(content);
      } else deleteIds.push(id);
    });
    if (templateItems?.length) await MissionTemplateItemModel.updateMany(templateItems);
    if (newContents?.length) await MissionTemplateItemModel.createMany(missionTemplateId, newContents);
    if (deleteIds?.length) await MissionTemplateItemModel.deleteManyById(deleteIds);
  } else await missionTemplateItemService.remove(missionTemplateId);
};

export const remove = async (missionTemplateId: number, membership: Membership, uid: number) => {
  const missionTemplate = await MissionTemplateModel.getOne(missionTemplateId);
  if (!missionTemplate) throw new ApplicationError(404);
  if (membership === 'vice' && uid !== missionTemplate.creatorId) throw new ApplicationError(403);

  await missionTemplateItemService.remove(missionTemplateId);

  const deleteMissionTemplate = await MissionTemplateItemModel.delete(missionTemplateId);
  if (!deleteMissionTemplate) throw new ApplicationError(400);
};
