const Task = require('../../models/guild/task.model');
const Item = require('../../models/guild/item.model');
const ItemRecord = require('../../models/guild/itemRecord.model');
const Adventurer = require('../../models/guild/adventurer.model');
const User = require('../../models/user/user.model');
const ApplicationError = require('../../utils/error/applicationError.js');
const userInfoController = new (require('../user/userinfoControllers.js'))();
const updateUserExp = userInfoController.updateUserExp;

class TaskController {
  async getAllTasks(req, res, next) {
    const query = await Adventurer.getAllByUser(req.session.passport.user);
    let data = [];
    if (query?.length) {
      await Promise.all(
        query.map(async (i) => {
          const tasks = await Task.getOne(i.TASK_ID);
          if (tasks?.length) {
            const task = await Promise.all(
              tasks
                .filter((row) => {
                  return row.STATUS === 'Established' || row.STATUS === 'In Progress';
                })
                .map(async (row) => {
                  return {
                    id: row.ID,
                    gid: row.GUILD_ID,
                    creator: row.CREATOR_ID,
                    name: row.NAME,
                    type: row.TYPE,
                    status: row.STATUS,
                    accepted: row.ACCEPTED,
                  };
                })
            );
            data.push(...task);
          }
        })
      );
    }
    return res.status(200).json({ data });
  }

  async getTasks(req, res, next) {
    const tasks = req.query.q
      ? await Task.getAllByGuildAndName(req.params.gid, req.query.q)
      : await Task.getAllByGuild(req.params.gid);
    let data;
    if (tasks?.length) {
      data = await Promise.all(
        tasks.map(async (row) => {
          const query = await Adventurer.getOne(row.ID, req.session.passport.user);
          let isAccepted = false;
          if (query?.length) isAccepted = true;
          return {
            id: row.ID,
            creator: row.CREATOR_ID,
            name: row.NAME,
            type: row.TYPE,
            status: row.STATUS,
            accepted: row.ACCEPTED,
            isAccepted: isAccepted,
          };
        })
      );
    }

    return res.status(200).json({ data });
  }

  async getTaskDetail(req, res, next) {
    const [task] = await Task.getOne(req.params.tid);
    let data;
    if (task?.ID) {
      const [user] = await User.getOneById(task.CREATOR_ID);
      const creator = {
        id: user.ID,
        name: user.NAME,
        imageUrl: user.IMAGE_URL,
      };
      let items,
        isAccepted = false;

      const query = await Adventurer.getAllByTask(req.params.tid);
      const adventurers = await Promise.all(
        query.map(async (row) => {
          const [user] = await User.getOneById(row.USER_ID);
          if (row.USER_ID === req.session.passport.user) isAccepted = true;
          return {
            id: row.USER_ID,
            name: user.NAME,
            imageUrl: user.IMAGE_URL,
            status: row.STATUS,
          };
        })
      );

      const q_item = await Item.getAll(req.params.tid);
      if (isAccepted) {
        items = await Promise.all(
          q_item.map(async (row) => {
            const itemRecord = await ItemRecord.getAllByItemAndUser(
              row.ID,
              req.session.passport.user
            );
            return {
              id: itemRecord[0].ID,
              status: itemRecord[0].STATUS,
              content: itemRecord[0].CONTENT,
            };
          })
        );
      } else {
        items = q_item.map((row) => {
          return {
            id: row.ID,
            content: row.CONTENT,
          };
        });
      }

      data = {
        creator: creator,
        id: task.ID,
        name: task.NAME,
        initiationTime: task.INITIATION_TIME,
        deadline: task.DEADLINE,
        description: task.DESCRIPTION,
        type: task.TYPE,
        maxAdventurer: task.MAX_ADVENTURER,
        adventurers: adventurers,
        status: task.STATUS,
        accepted: task.ACCEPTED,
        items: items,
        isAccepted: isAccepted,
      };

      return res.status(200).json({ data });
    }
    return next(new ApplicationError(409));
  }

  async acceptTask(req, res, next) {
    const [task] = await Task.getOne(req.params.tid);
    const [isAdventurer] = await Adventurer.getOne(req.params.tid, req.session.passport.user);
    if (!task?.ID) return next(new ApplicationError(404));
    if (isAdventurer) return next(new ApplicationError(409));
    if (task.ACCEPTED === 'Max Accepted') return next(new ApplicationError(409));

    const adventurer = await Adventurer.create(req.params.tid, req.session.passport.user);
    if (!adventurer?.affectedRows) {
      return next(new ApplicationError(400));
    }

    return res.status(200).json({ data: 'OK' });
  }

  async abandonTask(req, res, next) {
    const [isAdventurer] = await Adventurer.getOne(req.params.tid, req.session.passport.user);
    if (!isAdventurer) return next(new ApplicationError(409));

    await Adventurer.deleteByTaskAndUser(req.params.tid, req.session.passport.user);
    const items = await Item.getAll(req.params.tid);
    if (items && items?.length) {
      await Promise.all(
        items.map(async (i) => {
          const itemRecord = await ItemRecord.getAllByItemAndUser(i.id, req.session.passport.user);
          await ItemRecord.deleteOne(itemRecord[0].ID);
        })
      );
    }
    return res.status(200).json({ data: 'OK' });
  }

  async addTask(req, res, next) {
    const initiationTime = new Date(req.body.initiationTime);
    const deadline = new Date(req.body.deadline);
    if (initiationTime > deadline) {
      return next(new ApplicationError(409));
    }
    const newTask = await Task.create(
      req.session.passport.user,
      req.params.gid,
      req.body.name,
      `${initiationTime.getFullYear()}/${initiationTime.getMonth() + 1}/${initiationTime.getDate()} ${initiationTime.getHours()}:${initiationTime.getMinutes()}:${initiationTime.getDate()}`,
      `${deadline.getFullYear()}/${deadline.getMonth() + 1}/${deadline.getDate()} ${deadline.getHours()}:${deadline.getMinutes()}:${deadline.getDate()}`,
      req.body.description,
      req.body.type,
      req.body.maxAdventurer
    );
    if (newTask['insertId']) {
      if (req.body.items) {
        await Promise.all(
          req.body.items.map(async (i) => {
            const query = await Item.create(newTask['insertId'], i.content);
            if (!query['insertId']) return next(new ApplicationError(400));
          })
        );
      }
      return res.status(200).json({ data: { id: newTask['insertId'] } });
    }
  }

  async updateTask(req, res, next) {
    const taskDetail = await Task.getOne(req.params.tid);
    if (!taskDetail?.length) {
      return next(ApplicationError(404));
    } else if (
      req.member[0].MEMBERSHIP === 'Vice' &&
      req.session.passport.user !== taskDetail[0].CREATOR_ID
    ) {
      return next(new ApplicationError(403));
    }

    const task = await Task.updateDetail(
      req.params.tid,
      req.body.name,
      `${req.body.initiationTime.getFullYear()}/${req.body.initiationTime.getMonth() + 1}/${req.body.initiationTime.getDate()} ${req.body.initiationTime.getHours()}:${req.body.initiationTime.getMinutes()}:${req.body.initiationTime.getDate()}`,
      `${req.body.deadline.getFullYear()}/${req.body.deadline.getMonth() + 1}/${req.body.deadline.getDate()} ${req.body.deadline.getHours()}:${req.body.deadline.getMinutes()}:${req.body.deadline.getDate()}`,
      req.body.description,
      req.body.type,
      req.body.maxAdventurer
    );
    if (task.affectedRows) {
      if (req.body.items) {
        await Promise.all(
          req.body.items.map(async (i) => {
            if (i.content) {
              i.id
                ? await Item.update(i.id, i.content)
                : await Item.create(req.params.tid, i.content);
            } else {
              await Item.delete(i.id);
            }
          })
        );
      } else {
        await Item.deleteAll(req.params.tid);
      }

      return res.status(200).json({
        data: { id: req.params.tid },
      });
    }
  }

  async completeTask(req, res, next) {
    const taskDetail = await Task.getOne(req.params.tid);
    if (!taskDetail?.length) return next(ApplicationError(404));
    if (
      req.member[0].MEMBERSHIP === 'Vice' &&
      req.session.passport.user !== taskDetail[0].CREATOR_ID
    )
      return next(new ApplicationError(403));

    const adventurers = await Adventurer.getAllByTask(req.params.tid);
    if (adventurers && adventurers?.length) {
      await Promise.all(
        adventurers.map(async (i) => {
          const adventurer = await Adventurer.getOne(req.params.tid, i.USER_ID);
          if (adventurer[0].STATUS != 'Completed') {
            await Adventurer.updateStatus(req.params.tid, i.USER_ID, 'Failed');
          } else {
            await updateUserExp(1, i.USER_ID);
          }
        })
      );
    } else return next(new ApplicationError(409));

    const completeTask = await Task.updateStatus(req.params.tid, 'Completed');
    if (!completeTask.affectedRows)
      return next(new ApplicationError(400, 'Error in Task.completeTask().'));
    return res.status(200).json({ data: 'OK' });
  }

  async failTask(req, res, next) {
    const taskDetail = await Task.getOne(req.params.tid);
    if (!taskDetail?.length) return next(ApplicationError(404));
    if (
      req.member[0].MEMBERSHIP === 'Vice' &&
      req.session.passport.user !== taskDetail[0].CREATOR_ID
    )
      return next(new ApplicationError(403));

    const adventurers = await Adventurer.getAllByTask(req.params.tid);
    if (adventurers && adventurers?.length) {
      await Promise.all(
        adventurers.map(async (i) => {
          await Adventurer.updateStatus(req.params.tid, i.USER_ID, 'Failed');
        })
      );
    } else return next(new ApplicationError(409));

    const completeTask = await Task.updateStatus(req.params.tid, 'Expired');
    if (!completeTask.affectedRows) return next(new ApplicationError(400));
    return res.status(200).json({ data: 'OK' });
  }

  async cancelTask(req, res, next) {
    const taskDetail = await Task.getOne(req.params.tid);
    if (!taskDetail?.length) return next(ApplicationError(404));
    if (
      req.member[0].MEMBERSHIP === 'Vice' &&
      req.session.passport.user !== taskDetail[0].CREATOR_ID
    )
      return next(new ApplicationError(403));

    await Adventurer.deleteByTask(req.params.tid);
    const items = await Item.getAll(req.params.tid);
    if (items?.length) {
      await Promise.all(
        items.map(async (i) => {
          await ItemRecord.deleteAllByItem(i.id);
        })
      );
    }
    const cancelTask = await Task.updateStatus(req.params.tid, 'Cancelled');
    if (!cancelTask.affectedRows) return next(new ApplicationError(400));
    return res.status(200).json({ data: 'OK' });
  }

  async restoreTask(req, res, next) {
    const taskDetail = await Task.getOne(req.params.tid);
    if (!taskDetail?.length) return next(ApplicationError(404));
    if (
      req.member[0].MEMBERSHIP === 'Vice' &&
      req.session.passport.user !== taskDetail[0].CREATOR_ID
    )
      return next(new ApplicationError(403));

    const restoreTask = await Task.updateStatus(req.params.tid, 'Established');
    if (!restoreTask.affectedRows) return next(new ApplicationError(400));
    return res.status(200).json({ data: 'OK' });
  }

  async submitTask(req, res, next) {
    const taskDetail = await Task.getOne(req.params.tid);
    if (!taskDetail?.length) return next(ApplicationError(404));
    if (new Date(taskDetail[0].DEADLINE) < new Date())
      return next(new ApplicationError(400, 'Task has expired.'));

    const [adventurer] = await Adventurer.getOne(req.params.tid, req.session.passport.user);
    if (!adventurer) return next(new ApplicationError(409));
    const currentDate = new Date();
    const query = await Adventurer.update(
      req.params.tid,
      req.session.passport.user,
      'Completed',
      currentDate
    );
    if (!query['affectedRows']) {
      return next(new ApplicationError(400));
    }
    return res.status(200).json({ data: 'OK' });
  }

  async checkbox(req, res, next) {
    const itemRecord = await ItemRecord.getOne(req.body.itemRecordId);
    if (itemRecord?.length) {
      if (!itemRecord[0].STATUS) {
        await ItemRecord.update(req.body.itemRecordId, true);
      } else {
        await ItemRecord.update(req.body.itemRecordId, false);
      }
    } else return next(new ApplicationError(404));

    return res.status(200).json({ data: 'OK' });
  }

  async deleteTask(req, res, next) {
    const taskDetail = await Task.getOne(req.params.tid);
    if (!taskDetail?.length) return next(new ApplicationError(404));
    if (
      req.member[0].MEMBERSHIP === 'Vice' &&
      req.session.passport.user !== taskDetail[0].CREATOR_ID
    )
      return next(new ApplicationError(403));

    await Adventurer.deleteByTask(req.params.tid);
    const items = await Item.getAll(req.params.tid);
    if (items?.length) {
      await Promise.all(
        items.map(async (row) => {
          await ItemRecord.deleteAllByItem(row.ID);
        })
      );
      await Item.delete(req.params.tid);
    }

    const deleteTask = await Task.delete(req.params.tid);
    if (deleteTask.affectedRows) {
      return res.status(200).json({ data: 'OK' });
    }

    return next(new ApplicationError(404));
  }

  async autoUpdateStatus() {
    await Task.checkInitiationTimeEvent().catch(() =>
      console.log('checkInitiationTimeEvent error')
    );
    await Task.checkDeadlineEvent().catch(() => console.log('checkDeadlineEvent error'));
  }
}

module.exports = TaskController;
