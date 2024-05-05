const ApplicationError = require('../../utils/error/applicationError.js');
const Guild = require('../../models/guildModel');
const User = require('../../models/userModel');
const Adventurer = require('../../models/adventurerModel');
const Task = require('../../models/taskModel');
const TaskTemplate = require('../../models/taskTemplateModel.js');
const TemplateItem = require('../../models/templateItemModel');
const Item = require('../../models/itemModel');
const ItemRecord = require('../../models/itemRecordModel');
const UserGuildRelation = require('../../models/userGuildRelationModel');
const userInfoController = new (require('../user/userinfoControllers.js'))();
const updateUserExp = userInfoController.updateUserExp;

const checkAuth = async (user, gid, level) => {
  const member = await UserGuildRelation.getOneByGuildAndUser(user, gid);
  const message = (() => {
    if (!member?.length && level >= 0)
      return 'You are not a member of this guild, or you have not been invited.';
    if (member[0].MEMBERSHIP !== 'Vice' && member[0].MEMBERSHIP !== 'Master' && level >= 1)
      return 'Only guild Master and Vice have permission to access this resource.';
    if (member[0].MEMBERSHIP !== 'Master' && level >= 2)
      return 'Only guild Master have permission to access this resource.';
    return 'OK';
  })();
  return { message, member };
};
class GuildAuth {
  async isMember(req, res, next) {
    const { message, member } = await checkAuth(req.session.passport.user, req.params.gid, 0);
    if (message === 'OK') {
      req.member = member;
      return next();
    }
    return next(new ApplicationError(403, message));
  }
  async isMasterOrVice(req, res, next) {
    const { message, member } = await checkAuth(req.session.passport.user, req.params.gid, 1);
    if (message === 'OK') {
      req.member = member;
      return next();
    }
    return next(new ApplicationError(403, message));
  }
  async isMaster(req, res, next) {
    const { message, member } = await checkAuth(req.session.passport.user, req.params.gid, 2);
    if (message === 'OK') {
      req.member = member;
      return next();
    }
    return next(new ApplicationError(403, message));
  }
}

class GuildController {
  async getGuilds(req, res, next) {
    const query = req.query.q
      ? await UserGuildRelation.getAllByUserAndName(req.session.passport.user, req.query.q)
      : await UserGuildRelation.getAllByUser(req.session.passport.user);
    let guilds = [];
    if (query?.length) {
      guilds = await Promise.all(
        query.map(async (row) => {
          const [guild] = await Guild.getOne(row.GUILD_ID);
          const [userGuildRelation] = await UserGuildRelation.getOneByGuildAndUser(
            req.session.passport.user,
            row.GUILD_ID
          );
          return {
            id: guild.ID,
            membership: userGuildRelation.MEMBERSHIP,
            name: guild.NAME,
            imageUrl: guild.IMAGE_URL,
          };
        })
      );
    }
    return res.status(200).json({
      data: guilds.filter((row) => {
        return row.membership !== 'Pending';
      }),
    });
  }

  async getGuildDetail(req, res, next) {
    const [guild] = await Guild.getOne(req.params.gid);
    return res.status(200).json({
      data: {
        id: guild.ID,
        name: guild.NAME,
        description: guild.DESCRIPTION,
        imageUrl: guild.IMAGE_URL,
        cabin: guild.CABIN,
      },
    });
  }

  async addGuild(req, res, next) {
    const newGuild = await Guild.create(
      req.session.passport.user,
      req.body.name,
      req.body.description,
      req.body.imageUrl,
      false
    );
    if (newGuild['insertId']) {
      const newUserGuildRelation = await UserGuildRelation.create(
        req.session.passport.user,
        newGuild['insertId'],
        'Master'
      );
      if (newUserGuildRelation['affectedRows']) {
        await updateUserExp(1, req.session.passport.user);
        return res.status(200).json({ data: { id: newGuild['insertId'] } });
      }
    }
  }

  async addCabin(req, res, next) {
    const description = `In your Personal Cabin, you have the flexibility to select from various task types like 'Ordinary', 'Emergency', and 'Repetitive', tailoring them to your specific needs. Additionally, you can customize the recurrence frequency, whether it's daily, weekly, or monthly, to suit your schedule. Furthermore, tasks can be further broken down into multiple sub-goals, empowering you to gain a comprehensive overview of your pending tasks and strategize your approach for more efficient planning and completion.`;
    const imageUrl = `${process.env.UPLOAD_PATH}uploads/image/guild/Castle.svg`;
    const newGuild = await Guild.create(
      req.session.passport.user,
      'Personal Cabin',
      description,
      imageUrl,
      true
    );
    if (newGuild['insertId']) {
      const newUserGuildRelation = await UserGuildRelation.create(
        req.session.passport.user,
        newGuild['insertId'],
        'Master'
      );
      if (newUserGuildRelation['affectedRows']) {
        await updateUserExp(1, req.session.passport.user);
        return res.status(200).json({ data: { id: newGuild['insertId'] } });
      }
    }
  }

  async updateGuild(req, res, next) {
    const guild = await Guild.update(
      req.params.gid,
      req.body.name,
      req.body.description,
      req.body.imageUrl
    );
    if (guild.affectedRows) {
      return res.status(200).json({ data: { id: req.params.gid } });
    }
  }

  async deleteGuild(req, res, next) {
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
        await TemplateItem.deleteTemplateItemByTTId(row.ID);
        await TaskTemplate.delete(row.ID);
      });

    const query = await Guild.deleteGuild(req.params.gid);
    if (query.affectedRows) {
      return res.status(200).json({ data: 'OK' });
    }
  }
}

class UserGuildRelationController {
  async replyInvitation(req, res, next) {
    const member = await UserGuildRelation.getOneByGuildAndUser(
      req.session.passport.user,
      req.params.gid
    );
    if (!member?.length) {
      return next(new ApplicationError(409));
    }
    if (member[0].MEMBERSHIP !== 'Pending') {
      return next(new ApplicationError(410));
    }
    const query = await UserGuildRelation.update(
      req.session.passport.user,
      req.params.gid,
      'Regular'
    );
    if (query['affectedRows']) {
      return res.status(200).json({ data: 'OK' });
    }
  }

  async getMembers(req, res, next) {
    let guildMembers;
    const getGuildMembers = await UserGuildRelation.getAllByGuild(req.params.gid);
    if (getGuildMembers?.length) {
      guildMembers = await Promise.all(
        getGuildMembers.map(async (row) => {
          const [user] = await User.getOneById(row.USER_ID);
          const membership = await UserGuildRelation.getOneByGuildAndUser(user.ID, req.params.gid);
          return {
            id: user.ID,
            name: user.NAME,
            imageUrl: user.IMAGE_URL,
            rank: user.RANK,
            membership: membership[0].MEMBERSHIP,
          };
        })
      );
    }
    return res.status(200).json({ data: guildMembers });
  }

  async sendInvitation(req, res, next) {
    const member = await UserGuildRelation.getOneByGuildAndUser(req.body.uid, req.params.gid);
    console.log(req.body.uid, req.params.gid);
    if (member?.length) {
      return next(new ApplicationError(409));
    }
    const newmember = await UserGuildRelation.create(
      req.body.uid,

      req.params.gid,
      'Pending'
    );
    if (newmember['affectedRows']) {
      req.body.senderId = req.params.gid;
      req.body.recipientId = req.body.uid;
      req.body.type = 'Guild';
      return next();
    }
    return next(new ApplicationError(404));
  }

  async updateMember(req, res, next) {
    const query = await UserGuildRelation.update(
      req.params.uid,
      req.params.gid,
      req.body.membership
    );
    if (query['affectedRows']) return res.status(200).json({ data: 'OK' });
    if (!query?.length) return next(new ApplicationError(404));
  }

  async deleteMember(req, res, next) {
    const isMaster = req.member[0].MEMBERSHIP === 'Master';
    const isCurrentUser = req.session.passport.user == req.params.uid;
    if (isMaster && isCurrentUser) return next(new ApplicationError(403));
    if (isMaster || isCurrentUser) {
      const query = await UserGuildRelation.delete(req.params.uid, req.params.gid);
      if (query['affectedRows']) return res.status(200).json({ data: 'OK' });

      return next(new ApplicationError(404));
    }
    return next(new ApplicationError(403));
  }
}

module.exports = { GuildAuth, GuildController, UserGuildRelationController };
