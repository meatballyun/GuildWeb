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

  static async autoBuildTask() {
    console.log('autoBuildTask');
    const taskTemplates = await TaskTemplate.getAll().catch((err) =>
      console.log('getTaskTemplate error', err)
    );
    if (!taskTemplates?.length) return;
    const currentTime = new Date();
    taskTemplates.map(async (template) => {
      if (template.GENERATION_TIME < currentTime) {
        console.log(`Generate template ${template.ID}`);
        const newTask = await Task.create(
          template.CREATOR_ID,
          template.GUILD_ID,
          template.NAME,
          template.GENERATION_TIME,
          template.DEADLINE,
          template.DESCRIPTION,
          template.TYPE,
          template.MAX_ADVENTURER
        ).catch((err) => console.log('addTask error', err));
        if (newTask?.['insertId']) {
          const templateItems = await TaskTemplateItem.getAll(template.ID).catch((err) => {});
          if (templateItems?.length) {
            await Promise.all(
              templateItems.map(async (item) => {
                await Item.create(newTask['insertId'], item.CONTENT).catch((err) =>
                  console.log('addItem error', err)
                );
              })
            ).catch((err) => console.log('templateItems.map error', err));
          }
        }
        let unit;
        if (template.TYPE === 'Daily') unit = 'DAY';
        else if (template.TYPE === 'Weekly') unit = 'WEEK';
        else if (template.TYPE === 'Monthly') unit = 'MONTH';
        const generationTime = await TaskTemplate.DATE_ADD(template.GENERATION_TIME, 1, unit).catch(
          (err) => console.log('generationTime.DATE_ADD error', err)
        );
        const deadline = await TaskTemplate.DATE_ADD(template.DEADLINE, 1, unit).catch((err) =>
          console.log('deadline.DATE_ADD error', err)
        );
        await TaskTemplate.updateTime(
          template.ID,
          Object.values(generationTime[0])[0],
          Object.values(deadline[0])[0]
        ).catch((err) => console.log('updateTaskTemplateTime error', err));
      }
    });
  }
}

module.exports = TaskTemplateController;
