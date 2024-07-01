import { TypedRequest } from '../../types/TypedRequest';
import { Response, NextFunction } from 'express';
import { GuildModel } from '../../models/guild/guild';
import { AdventurerModel } from '../../models/guild/adventurer';
import { TaskModel } from '../../models/guild/task';
import { TaskTemplateModel } from '../../models/guild/taskTemplate';
import { TaskTemplateItemModel } from '../../models/guild/taskTemplateItem';
import { ItemModel } from '../../models/guild/item';
import { ItemRecordModel } from '../../models/guild/itemRecord';
import { GuildService } from '../../services/guild/guild';
import { UserInfoService } from '../../services/user/userInfo';

export class GuildController {
  static async getGuilds(req: TypedRequest, res: Response, next: NextFunction) {
    const data = await GuildService.getAll(req.session.passport.user);
    return res.status(200).json({ data });
  }

  static async getGuildDetail(req: TypedRequest, res: Response, next: NextFunction) {
    const data = await GuildService.getOne(req.params.gid);
    return res.status(200).json({ data });
  }

  static async addGuild(req: TypedRequest, res: Response, next: NextFunction) {
    const data = await GuildService.create(req.body, req.session.passport.user);
    await UserInfoService.updateExp(req.session.passport.user, 1);
    return res.status(200).json({ data });
  }

  static async addCabin(req: TypedRequest, res: Response, next: NextFunction) {
    const data = await GuildService.addCabin(req.session.passport.user);
    await UserInfoService.updateExp(req.session.passport.user, 1);
    return res.status(200).json({ data });
  }

  static async updateGuild(req: TypedRequest, res: Response, next: NextFunction) {
    await GuildService.update(req.params.gid, req.body);
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
