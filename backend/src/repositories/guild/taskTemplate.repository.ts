import { ApplicationError } from '../../utils/error/applicationError';
import { timeHandle, formatTimestamp } from '../../utils/timeHandler';
import { User } from '../../types/user/user';
import { Membership } from '../../types/user/userGuildRelation';
import { TaskTemplateInfo, TaskTemplateTime } from '../../types/guild/taskTemplate';
import { TaskTemplateModel } from '../../models/guild/taskTemplate.model';
import { TaskTemplateItemModel } from '../../models/guild/taskTemplateItem.model';
import { UserModel } from '../../models/user/user.model';
import { Item } from '../../repositories/guild/taskTemplateItem.repository';
import { TaskTemplateItemRepository } from '../../repositories/guild/taskTemplateItem.repository';

interface TaskTemplateDetailed extends TaskTemplateTime, TaskTemplateInfo {
  items: Item[];
}

export class TaskTemplateRepository {
  static async getAll(guildId: number, query?: string) {
    const taskTemplates = query ? await TaskTemplateModel.getAllByGuildAndName(guildId, query) : await TaskTemplateModel.getAllByGuild(guildId);
    if (taskTemplates?.length) {
      const data = await Promise.all(
        taskTemplates.map(async ({ id, enabled, creator, name, type }) => {
          return { id, enabled, creator, name, type };
        })
      );
      return data;
    }
  }

  static async getOne(taskTemplateId: number) {
    const taskTemplate = await TaskTemplateModel.getOne(taskTemplateId);
    if (taskTemplate) {
      const { id, name, imageUrl } = (await UserModel.getOneById(taskTemplate.creatorId)) as User;
      if (!id) throw new ApplicationError(409);
      const items = await TaskTemplateItemRepository.getAll(taskTemplateId);
      return {
        creator: { id, name, imageUrl },
        ...taskTemplate,
        items,
      };
    } else throw new ApplicationError(404);
  }

  static async create({ generationTime, deadline, items, ...otherData }: TaskTemplateDetailed, guildId: number, uid: number) {
    let time = await timeHandle(generationTime, deadline);
    const newTemplateId = await TaskTemplateModel.create(uid, guildId, time, otherData);
    if (!newTemplateId) throw new ApplicationError(400);

    await TaskTemplateItemRepository.create(items, newTemplateId);
    return { id: newTemplateId };
  }

  // prettier-ignore
  static async update({ generationTime, deadline, items, ...otherData }: TaskTemplateDetailed, taskTemplateId:number, { membership }:{membership:Membership}, uid:number) {
    const taskTemplate = await TaskTemplateModel.getOne(taskTemplateId);
    if (!taskTemplate) throw new ApplicationError(404);
    if (membership === 'vice' && uid !== taskTemplate.creatorId) throw new ApplicationError(403);
    if (generationTime > deadline) throw new ApplicationError(409);

    const time = { generationTime: formatTimestamp(generationTime), deadline: formatTimestamp(deadline) };
    const result = await TaskTemplateModel.update( taskTemplateId, time, otherData );
    if (!result) throw new ApplicationError(400);
      if (items) {
        await Promise.all(
          items.map(async ({ id, content }) => {
            if (content) {
              id ? await TaskTemplateItemModel.update(id, content) : await TaskTemplateItemModel.create(taskTemplateId, content);
            } else await TaskTemplateItemModel.delete(id);
          })
        );
      } else await TaskTemplateItemRepository.delete(taskTemplateId);
  }

  static async delete(taskTemplateId: number, membership: Membership, uid: number) {
    const taskTemplate = await TaskTemplateModel.getOne(taskTemplateId);
    if (!taskTemplate) throw new ApplicationError(404);
    if (membership === 'vice' && uid !== taskTemplate.creatorId) throw new ApplicationError(403);

    await TaskTemplateItemRepository.delete(taskTemplateId);

    const deleteTaskTemplate = await TaskTemplateItemModel.delete(taskTemplateId);
    if (!deleteTaskTemplate) throw new ApplicationError(400);
  }
}
