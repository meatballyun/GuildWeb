import { TypedRequest } from '../../types/TypedRequest';
import { Response, NextFunction } from 'express';
import { GuildModel } from '../../models/guild/guild';
import { AdventurerModel } from '../../models/guild/adventurer';
import { MissionModel } from '../../models/guild/mission';
import { MissionTemplateModel } from '../../models/guild/missionTemplate';
import { MissionTemplateItemModel } from '../../models/guild/missionTemplateItem';
import { ItemModel } from '../../models/guild/item';
import { ItemRecordModel } from '../../models/guild/itemRecord';
import { guildService } from '../../services/guild';
import { userInfoService } from '../../services/user';

export class GuildController {
  static async getGuilds(req: TypedRequest, res: Response, next: NextFunction) {
    const data = await guildService.getAll(req.userId as number);
    return res.status(200).json({ data });
  }

  static async getGuildDetail(req: TypedRequest, res: Response, next: NextFunction) {
    const data = await guildService.getOne(req.params.gid);
    return res.status(200).json({ data });
  }

  static async addGuild(req: TypedRequest, res: Response, next: NextFunction) {
    const data = await guildService.create(req.body, req.userId as number);
    await userInfoService.updateExp(req.userId as number, 1);
    return res.status(200).json({ data });
  }

  static async addCabin(req: TypedRequest, res: Response, next: NextFunction) {
    const data = await guildService.addCabin(req.userId as number);
    await userInfoService.updateExp(req.userId as number, 1);
    return res.status(200).json({ data });
  }

  static async updateGuild(req: TypedRequest, res: Response, next: NextFunction) {
    await guildService.update(req.params.gid, req.body);
    return res.status(200).json({ data: req.params.gid });
  }

  static async deleteGuild(req: TypedRequest, res: Response, next: NextFunction) {
    const missions = await MissionModel.getAllByGuild(req.params.gid);
    if (missions?.length) {
      missions.map(async (row) => {
        await AdventurerModel.deleteByMission(row.ID);
        const items = await ItemModel.getAll(row.ID);
        if (items && items?.length) {
          await Promise.all(
            items.map(async (i) => {
              const itemRecord = await ItemRecordModel.getAllByItemAndUser(i.id, req.userId as number);
              if (itemRecord && itemRecord?.length) {
                await ItemRecordModel.deleteAllByItem(itemRecord[0].ID);
              }
            })
          );
        }
        await ItemModel.deleteAll(row.ID);
        await MissionModel.delete(row.ID);
      });
    }

    const missionTemplates = await MissionTemplateModel.getAllByGuild(req.params.gid);
    if (missionTemplates?.length)
      missionTemplates.map(async (row) => {
        await MissionTemplateItemModel.deleteByMissionTemplate(row.ID);
        await MissionTemplateModel.delete(row.ID);
      });

    const query = await GuildModel.deleteGuild(req.params.gid);
    if (query) {
      return res.status(200).json({ data: 'OK' });
    }
  }
}
