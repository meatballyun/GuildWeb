const Task = require('../../models/guild/task.model');
const Adventurer = require('../../models/guild/adventurer.model');
const TaskRepository = require('../../repositories/guild/task.repository.js');

class TaskController {
  static async getUserTasks(req, res, next) {
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

  static async getTasks(req, res, next) {
    const data = await TaskRepository.getAll(req.params, req.query, req.session.passport.user);
    return res.status(200).json({ data });
  }

  static async getTaskDetail(req, res, next) {
    const data = await TaskRepository.getOne(req.params, req.session.passport.user);
    return res.status(200).json({ data });
  }

  static async acceptTask(req, res, next) {
    await TaskRepository.accept(req.params, req.session.passport.user);
    return res.status(200).json({ data: 'OK' });
  }

  static async abandonTask(req, res, next) {
    await TaskRepository.abandon(req.params, req.session.passport.user);
    return res.status(200).json({ data: 'OK' });
  }

  static async addTask(req, res, next) {
    const data = await TaskRepository.create(req.body, req.params.gid, req.session.passport.user);
    return res.status(200).json({ data });
  }

  static async completeTask(req, res, next) {
    await TaskRepository.complete(req.params, req.member, req.session.passport.user);
    return res.status(200).json({ data: 'OK' });
  }

  static async failTask(req, res, next) {
    await TaskRepository.fail(req.params, req.member, req.session.passport.user);
    return res.status(200).json({ data: 'OK' });
  }

  static async updateTask(req, res, next) {
    // prettier-ignore
    const data = await TaskRepository.update( req.body, req.params, req.member, req.session.passport.user);
    return res.status(200).json({ data });
  }

  static async cancelTask(req, res, next) {
    await TaskRepository.cancel(req.params, req.member, req.session.passport.user);
    return res.status(200).json({ data: 'OK' });
  }

  static async restoreTask(req, res, next) {
    await TaskRepository.restore(req.params, req.member, req.session.passport.user);
    return res.status(200).json({ data: 'OK' });
  }

  static async submitTask(req, res, next) {
    await TaskRepository.submit(req.params, req.session.passport.user);
    return res.status(200).json({ data: 'OK' });
  }

  static async clickCheckboxForItemRecord(req, res, next) {
    await TaskRepository.clickCheckboxForItemRecord(req.body.itemRecordId);
    return res.status(200).json({ data: 'OK' });
  }

  static async deleteTask(req, res, next) {
    await TaskRepository.delete(req.params, req.member, req.session.passport.user);
    return res.status(200).json({ data: 'OK' });
  }
}

module.exports = TaskController;
