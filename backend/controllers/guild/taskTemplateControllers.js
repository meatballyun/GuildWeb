const TaskTemplate = require('../../models/taskTemplateModel.js');
const TemplateItem = require('../../models/templateItemModel');
const Task = require('../../models/taskModel');
const Item = require('../../models/itemModel');
const User = require('../../models/userModel');
const ApplicationError = require('../../utils/error/applicationError.js');

class TaskTemplateController {
  async getTaskTemplates(req, res, next) {
    try {
      const taskTemplates = req.query.q
        ? await TaskTemplate.getTaskTemplateByGuildIdAndName(req.params.gid, req.query.q)
        : await TaskTemplate.getTaskTemplateByGuildId(req.params.gid);
      let data;
      if (taskTemplates?.length) {
        data = await Promise.all(
          taskTemplates.map(async (row) => {
            return {
              id: row.ID,
              enabled: row.ENABLED,
              creator: row.CREATOR_ID,
              name: row.NAME,
              type: row.TYPE,
            };
          })
        );
      }
      return res.status(200).json({
        success: true,
        message: 'Data uploaded successfully.',
        data: data,
      });
    } catch (err) {
      return next(new ApplicationError(400, err));
    }
  }

  async getTaskTemplateDetail(req, res, next) {
    try {
      const [taskTemplate] = await TaskTemplate.getTaskTemplateById(req.params.ttid);
      if (taskTemplate && taskTemplate.ID) {
        const [user] = await User.getUserById(taskTemplate.CREATOR_ID);
        if (!user || !user.ID) return next(new ApplicationError(409));
        const query = await TemplateItem.getTemplateItem(req.params.ttid);
        let items = [];
        if (query?.length) {
          items = await Promise.all(
            query.map(async (row) => {
              return {
                id: row.ID,
                content: row.CONTENT,
              };
            })
          );
        }
        return res.status(200).json({
          success: true,
          message: 'Data uploaded successfully.',
          data: {
            id: taskTemplate.ID,
            creator: {
              id: user.ID,
              name: user.NAME,
              imageUrl: user.IMAGE_URL,
            },
            enabled: taskTemplate.ENABLED,
            name: taskTemplate.NAME,
            description: taskTemplate.DESCRIPTION,
            generationTime: taskTemplate.GENERATION_TIME,
            deadline: taskTemplate.DEADLINE,
            type: taskTemplate.TYPE,
            maxAdventurer: taskTemplate.MAX_ADVENTURER,
            items: items,
          },
        });
      } else return next(new ApplicationError(409));
    } catch (err) {
      return next(new ApplicationError(400, err));
    }
  }

  async addTaskTemplate(req, res, next) {
    try {
      const generationTime = req.body.generationTime.replace('T', ' ').replace('Z', '');
      const deadline = req.body.deadline.replace('T', ' ').replace('Z', '');
      if (generationTime > deadline) {
        return next(new ApplicationError(409, 'Deadline cannot be earlier than  generationTime.'));
      }
      const newTemplate = await TaskTemplate.addTaskTemplate(
        req.session.passport.user,
        req.params.gid,
        req.body.name,
        req.body.description,
        generationTime,
        deadline,
        req.body.type,
        req.body.maxAdventurer
      );
      if (!newTemplate['affectedRows']) {
        return next(new ApplicationError(400, 'Error in addTaskTemplate()'));
      }
      if (req.body.items) {
        await Promise.all(
          req.body.items.map(async (i) => {
            const query = await TemplateItem.addTemplateItem(newTemplate['insertId'], i.content);
            if (!query['insertId'])
              return next(
                new ApplicationError(400, "Error in parameter or missing parameter 'CONTENT'.")
              );
          })
        );
      }

      return res.status(200).json({
        success: true,
        message: 'Data uploaded successfully.',
        data: {
          id: newTemplate['insertId'],
        },
      });
    } catch (err) {
      return next(new ApplicationError(400, err));
    }
  }

  async updateTaskTemplate(req, res, next) {
    try {
      const taskTemplateDetail = await TaskTemplate.getTaskTemplateById(req.params.ttid);
      if (!taskTemplateDetail?.length) {
        return next(ApplicationError(404, 'The task cannot be found in this guild.'));
      } else if (
        req.member[0].MEMBERSHIP === 'Vice' &&
        req.session.passport.user !== taskTemplateDetail[0].CREATOR_ID
      ) {
        return next(
          new ApplicationError(403, 'Only guild Master have permission to access this resource.')
        );
      }

      const generationTime = new Date(req.body.generationTime)
        .toISOString()
        .replace('T', ' ')
        .replace('Z', '');
      const deadline = new Date(req.body.deadline).toISOString().replace('T', ' ').replace('Z', '');
      if (generationTime > deadline) {
        return next(new ApplicationError(409, 'Deadline cannot be earlier than  generationTime.'));
      }

      const taskTemplate = await TaskTemplate.updateTaskTemplate(
        req.params.ttid,
        req.body.enabled,
        req.body.name,
        req.body.description,
        generationTime,
        deadline,
        req.body.type,
        req.body.maxAdventurer
      );
      if (taskTemplate.affectedRows) {
        if (req.body.items) {
          await Promise.all(
            req.body.items.map(async (i) => {
              if (i.content) {
                i.id
                  ? await TemplateItem.updateTemplateItem(i.id, i.content)
                  : await TemplateItem.addTemplateItem(req.params.ttid, i.content);
              } else {
                console.log(i.id);
                await TemplateItem.deleteTemplateItem(i.id);
              }
            })
          );
        } else {
          const query = await TemplateItem.getTemplateItem(req.params.ttid);
          if (query) {
            await TemplateItem.deleteTemplateItemByTTId(req.params.ttid);
          }
        }

        return res.status(200).json({
          success: true,
          message: 'Data update successfully.',
          data: {
            id: req.params.ttid,
          },
        });
      }
      return next(new ApplicationError(400, 'Data update fail'));
    } catch (err) {
      return next(new ApplicationError(400, err));
    }
  }

  async deleteTaskTemplate(req, res, next) {
    try {
      const taskTemplate = await TaskTemplate.getTaskTemplateById(req.params.ttid);
      if (!taskTemplate?.length) {
        return next(ApplicationError(404, 'The taskTemplate cannot be found in this guild.'));
      } else if (
        req.member[0].MEMBERSHIP === 'Vice' &&
        req.session.passport.user !== taskTemplate[0].CREATOR_ID
      ) {
        return next(new ApplicationError(403));
      }

      const items = await TemplateItem.getTemplateItem(req.params.ttid);
      if (items && items?.length) {
        await TemplateItem.deleteTemplateItemByTTId(req.params.ttid);
      }

      const deleteTaskTemplate = await TaskTemplate.deleteTaskTemplate(req.params.ttid);
      if (deleteTaskTemplate.affectedRows) {
        return res.status(200).json({
          success: true,
          message: 'Data delete successful.',
          data: 'OK',
        });
      } else {
        return next(new ApplicationError(404, 'The task cannot be found in this guild.'));
      }
    } catch (err) {
      return next(new ApplicationError(400, err));
    }
  }

  async autoBuildTask() {
    console.log('autoBuildTask');
    const taskTemplates = await TaskTemplate.getTaskTemplate().catch((err) =>
      console.log('getTaskTemplate error', err)
    );
    if (!taskTemplates?.length) return;
    const currentTime = new Date();
    taskTemplates.map(async (template) => {
      if (template.GENERATION_TIME < currentTime) {
        console.log(`Generate template ${template.ID}`);
        const newTask = await Task.addTask(
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
          const templateItems = await TemplateItem.getTemplateItem(template.ID).catch((err) =>
            console.log('getTemplateItem error', err)
          );
          if (templateItems?.length) {
            await Promise.all(
              templateItems.map(async (item) => {
                await Item.addItem(newTask['insertId'], item.CONTENT).catch((err) =>
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
        await TaskTemplate.updateTaskTemplateTime(
          template.ID,
          Object.values(generationTime[0])[0],
          Object.values(deadline[0])[0]
        ).catch((err) => console.log('updateTaskTemplateTime error', err));
      }
    });
  }
}

module.exports = TaskTemplateController;
