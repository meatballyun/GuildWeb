import { TypedRequest } from '../../types/TypedRequest';
import { Response, NextFunction } from 'express';
import { GuildModel } from '../../models/guild/guild.model';
import { AdventurerModel } from '../../models/guild/adventurer.model';
import { TaskModel } from '../../models/guild/task.model';
import { TaskTemplateModel } from '../../models/guild/taskTemplate.model';
import { TaskTemplateItemModel } from '../../models/guild/taskTemplateItem.model';
import { ItemModel } from '../../models/guild/item.model';
import { ItemRecordModel } from '../../models/guild/itemRecord.model';
import { GuildRepository } from '../../repositories/guild/guild.repository';
import { UserInfoRepository } from '../../repositories/user/userInfo.repository';

export class GuildController {
  static async getGuilds(req: TypedRequest, res: Response, next: NextFunction) {
    const data = await GuildRepository.getAll(req.session.passport.user);
    return res.status(200).json({ data });
  }

  static async getGuildDetail(req: TypedRequest, res: Response, next: NextFunction) {
    const data = await GuildRepository.getOne(req.params.gid);
    return res.status(200).json({ data });
  }

  static async addGuild(req: TypedRequest, res: Response, next: NextFunction) {
    const data = await GuildRepository.create(req.body, req.session.passport.user);
    await UserInfoRepository.updateExp(req.session.passport.user, 1);
    return res.status(200).json({ data });
  }

  static async addCabin(req: TypedRequest, res: Response, next: NextFunction) {
    const data = await GuildRepository.addCabin(req.session.passport.user);
    await UserInfoRepository.updateExp(req.session.passport.user, 1);
    return res.status(200).json({ data });
  }

  static async updateGuild(req: TypedRequest, res: Response, next: NextFunction) {
    await GuildRepository.update(req.params.gid, req.body);
    return res.status(200).json({ data: req.params.gid });
  }

  static async deleteGuild(req: TypedRequest, res: Response, next: NextFunction) {
    const tasks = await TaskModel.getAllByGuild(req.params.gid);
    if (tasks?.length) {
      tasks.map(async (row) => {
        await AdventurerModel.deleteByTask(row.ID);
        const items = await ItemModel.getAll(row.ID);
        if (items && items?.length) {
          await Promise.all(
            items.map(async (i) => {
              const itemRecord = await ItemRecordModel.getAllByItemAndUser(i.id, req.session.passport.user);
              if (itemRecord && itemRecord?.length) {
                await ItemRecordModel.deleteAllByItem(itemRecord[0].ID);
              }
            })
          );
        }
        await ItemModel.deleteAll(row.ID);
        await TaskModel.delete(row.ID);
      });
    }

    const taskTemplates = await TaskTemplateModel.getAllByGuild(req.params.gid);
    if (taskTemplates?.length)
      taskTemplates.map(async (row) => {
        await TaskTemplateItemModel.deleteByTaskTemplate(row.ID);
        await TaskTemplateModel.delete(row.ID);
      });

    const query = await GuildModel.deleteGuild(req.params.gid);
    if (query) {
      return res.status(200).json({ data: 'OK' });
    }
  }
}
