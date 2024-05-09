const TaskTemplate = require('../../models/guild/taskTemplate.model.js');
const TaskTemplateItem = require('../../models/guild/taskTemplateItem.model');
const Task = require('../../models/guild/task.model');
const Item = require('../../models/guild/item.model');
const TaskTemplateRepository = require('../../repositories/guild/taskTemplate.repository.js');

class TaskTemplateController {
  static async getTaskTemplates(req, res, next) {
    const data = await TaskTemplateRepository.getAll(req.params.gid, req.query.q);
    return res.status(200).json({ data });
  }

  static async getTaskTemplateDetail(req, res, next) {
    const data = await TaskTemplateRepository.getOne(req.params.ttid);
    return res.status(200).json({ data });
  }

  static async addTaskTemplate(req, res, next) {
    const data = await TaskTemplateRepository.create(
      req.body,
      req.params.gid,
      req.session.passport.user
    );
    return res.status(200).json({ data });
  }

  static async updateTaskTemplate(req, res, next) {
    const data = await TaskTemplateRepository.update(
      req.body,
      req.params.ttid,
      req.member,
      req.session.passport.user
    );
    return res.status(200).json({ data });
  }

  static async deleteTaskTemplate(req, res, next) {
    await TaskTemplateRepository.delete(req.params.ttid, req.member, req.session.passport.user);
    return res.status(200).json({ data: 'OK' });
  }
}

module.exports = TaskTemplateController;
