import { ApplicationError } from '../../utils/error/applicationError';
import { timeHandle, formatTimestamp } from '../../utils/timeHandler';
import { User } from '../../types/user/user';
import { Membership } from '../../types/user/userGuildRelation';
import { MissionTemplateInfo, MissionTemplateTime } from '../../types/guild/missionTemplate';
import { MissionTemplateModel } from '../../models/guild/missionTemplate';
import { MissionTemplateItemModel } from '../../models/guild/missionTemplateItem';
import { UserModel } from '../../models/user/user';
import { Item } from '../../services/guild/missionTemplateItem';
import { MissionTemplateItemService } from '../../services/guild/missionTemplateItem';

interface MissionTemplateDetailed extends MissionTemplateTime, MissionTemplateInfo {
  items: Item[];
}

export class MissionTemplateService {
  static async getAll(guildId: number, query?: string) {
    const missionTemplates = query ? await MissionTemplateModel.getAllByGuildAndName(guildId, query) : await MissionTemplateModel.getAllByGuild(guildId);
    if (missionTemplates?.length) {
      const data = await Promise.all(
        missionTemplates.map(async ({ id, enabled, creator, name, type }) => {
          return { id, enabled, creator, name, type };
        })
      );
      return data;
    }
  }

  static async getOne(missionTemplateId: number) {
    const missionTemplate = await MissionTemplateModel.getOne(missionTemplateId);
    if (missionTemplate) {
      const { id, name, imageUrl } = (await UserModel.getOneById(missionTemplate.creatorId)) as User;
      if (!id) throw new ApplicationError(409);
      const items = await MissionTemplateItemService.getAll(missionTemplateId);
      return {
        creator: { id, name, imageUrl },
        ...missionTemplate,
        items,
      };
    } else throw new ApplicationError(404);
  }

  static async create({ generationTime, deadline, items, ...otherData }: MissionTemplateDetailed, guildId: number, uid: number) {
    let time = await timeHandle(generationTime, deadline);
    const newTemplateId = await MissionTemplateModel.create(uid, guildId, time, otherData);
    if (!newTemplateId) throw new ApplicationError(400);

    await MissionTemplateItemService.create(items, newTemplateId);
    return { id: newTemplateId };
  }

  // prettier-ignore
  static async update({ generationTime, deadline, items, ...otherData }: MissionTemplateDetailed, missionTemplateId:number, membership: Membership, uid:number) {
    const missionTemplate = await MissionTemplateModel.getOne(missionTemplateId);
    if (!missionTemplate) throw new ApplicationError(404);
    if (membership === 'vice' && uid !== missionTemplate.creatorId) throw new ApplicationError(403);
    if (generationTime > deadline) throw new ApplicationError(409);

    const time = { generationTime: formatTimestamp(generationTime), deadline: formatTimestamp(deadline) };
    const result = await MissionTemplateModel.update( missionTemplateId, time, otherData );
    if (!result) throw new ApplicationError(400);
      if (items) {
        await Promise.all(
          items.map(async ({ id, content }) => {
            if (content) {
              id ? await MissionTemplateItemModel.update(id, content) : await MissionTemplateItemModel.create(missionTemplateId, content);
            } else await MissionTemplateItemModel.delete(id);
          })
        );
      } else await MissionTemplateItemService.delete(missionTemplateId);
  }

  static async delete(missionTemplateId: number, membership: Membership, uid: number) {
    const missionTemplate = await MissionTemplateModel.getOne(missionTemplateId);
    if (!missionTemplate) throw new ApplicationError(404);
    if (membership === 'vice' && uid !== missionTemplate.creatorId) throw new ApplicationError(403);

    await MissionTemplateItemService.delete(missionTemplateId);

    const deleteMissionTemplate = await MissionTemplateItemModel.delete(missionTemplateId);
    if (!deleteMissionTemplate) throw new ApplicationError(400);
  }
}
