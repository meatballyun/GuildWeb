// @ts-nocheck
import Guild from '../../models/guild/guild.model';
import Adventurer from '../../models/guild/adventurer.model';
import Task from '../../models/guild/task.model';
import TaskTemplate from '../../models/guild/taskTemplate.model';
import TaskTemplateItem from '../../models/guild/taskTemplateItem.model';
import Item from '../../models/guild/item.model';
import ItemRecord from '../../models/guild/itemRecord.model';
import UserGuildRelation from '../../models/user/userGuildRelation.model';
import GuildRepository from '../../repositories/guild/guild.repository';
import UserInfoRepository from '../../repositories/user/userInfo.repository';

class GuildController {
  static async getGuilds(req, res, next) {
    const data = await GuildRepository.getAll(req.session.passport.user);
    return res.status(200).json({ data });
  }

  static async getGuildDetail(req, res, next) {
    const data = await GuildRepository.getOne(req.params.gid);
    return res.status(200).json({ data });
  }

  static async addGuild(req, res, next) {
    const data = await GuildRepository.create(req.body, req.session.passport.user);
    await UserInfoRepository.updateExp(req.session.passport.user, 1);
    return res.status(200).json({ data });
  }

  static async addCabin(req, res, next) {
    const data = await GuildRepository.addCabin(req.session.passport.user);
    await UserInfoRepository.updateExp(req.session.passport.user, 1);
    return res.status(200).json({ data });
  }

  static async updateGuild(req, res, next) {
    await GuildRepository.update(req.params.gid, req.body);
    return res.status(200).json({ data: req.params.gid });
  }

  static async deleteGuild(req, res, next) {
    const tasks = await Task.getAllByGuild(req.params.gid);
    if (tasks?.length) {
      tasks.map(async (row) => {
        await Adventurer.deleteAdventurerByTask(row.ID);
        const items = await Item.getItem(row.ID);
        if (items && items?.length) {
          await Promise.all(
            items.map(async (i) => {
              const itemRecord = await ItemRecord.getItemRecordByItemAndUser(
                i.id,
                req.session.passport.user
              );
              if (itemRecord && itemRecord?.length) {
                await ItemRecord.deleteItemRecordByItem(itemRecord[0].ID);
              }
            })
          );
        }
        await Item.deleteItems(row.ID);
        await Task.deleteTask(row.ID);
      });
    }

    const taskTemplates = await TaskTemplate.getAllByGuild(req.params.gid);
    if (taskTemplates?.length)
      taskTemplates.map(async (row) => {
        await TaskTemplateItem.deleteByTaskTemplate(row.ID);
        await TaskTemplate.delete(row.ID);
      });

    const query = await Guild.deleteGuild(req.params.gid);
    if (query.affectedRows) {
      return res.status(200).json({ data: 'OK' });
    }
  }
}

export default GuildController;
