const Guild = require('../../models/guild/guild.model');
const Adventurer = require('../../models/guild/adventurer.model');
const Task = require('../../models/guild/task.model');
const TaskTemplate = require('../../models/guild/taskTemplate.model.js');
const TaskTemplateItem = require('../../models/guild/taskTemplateItem.model');
const Item = require('../../models/guild/item.model');
const ItemRecord = require('../../models/guild/itemRecord.model');
const UserGuildRelation = require('../../models/user/userGuildRelation.model');
const GuildRepository = require('../../repositories/guild/guild.repository.js');
const UserInfoRepository = require('../../repositories/user/userInfo.repository.js');

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

module.exports = GuildController;
