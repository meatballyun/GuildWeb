const TaskTemplate = require('../../models/guild/taskTemplate.model.js');
const TaskTemplateItem = require('../../models/guild/taskTemplateItem.model.js');
const TaskTemplateItemRepository = require('../../repositories/guild/taskTemplateItem.repository.js');
const User = require('../../models/user/user.model');
const ApplicationError = require('../../utils/error/applicationError.js');
const { timeHandle } = require('../../utils/timeHandler.js');

class TaskTemplateRepository {
  static async getAll(guildId, query) {
    const taskTemplates = query
      ? await TaskTemplate.getAllByGuildAndName(guildId, query)
      : await TaskTemplate.getAllByGuild(guildId);

    if (taskTemplates?.length) {
      const data = await Promise.all(
        taskTemplates.map(async ({ id, enabled, creator, name, type }) => {
          return { id, enabled, creator, name, type };
        })
      );
      return data;
    }
  }

  static async getOne(taskTemplateId) {
    const taskTemplate = await TaskTemplate.getOne(taskTemplateId);
    if (taskTemplate) {
      const { id, name, imageUrl } = await User.getOneById(taskTemplate.creatorId);
      if (!id) throw new ApplicationError(409);
      const items = await TaskTemplateItemRepository.getAll(taskTemplateId);
      return {
        creator: { id, name, imageUrl },
        ...taskTemplate,
        items,
      };
    } else throw new ApplicationError(404);
  }

  static async create({ generationTime, deadline, items, ...otherData }, guildId, uid) {
    const time = await timeHandle(generationTime, deadline);
    const newTemplateId = await TaskTemplate.create(uid, guildId, time, otherData);
    if (!newTemplateId) throw new ApplicationError(400);

    await TaskTemplateItemRepository.create(items, newTemplateId);
    return { id: newTemplateId };
  }

  // prettier-ignore
  static async update({ generationTime, deadline, items, ...otherData }, taskTemplateId, { membership }, uid) {
    const taskTemplate = await TaskTemplate.getOne(taskTemplateId);
    if (!taskTemplate) throw new ApplicationError(404);
    if (membership === 'Vice' && uid !== taskTemplate.creatorId) throw new ApplicationError(403);
    if (generationTime > deadline) throw new ApplicationError(409);

    const time = await timeHandle(generationTime, deadline);
    const result = await TaskTemplate.update( taskTemplateId, time, otherData );
    if (!result) throw new ApplicationError(400);
    if (items) {
      await Promise.all(
        items.map(async ({ id, content }) => {
          if (content) {
            id ? await TaskTemplateItem.update(id, content) : await TaskTemplateItem.create(taskTemplateId, content);
          } else await TaskTemplateItem.delete(id);
        })
      );
    } else await TaskTemplateItemRepository.delete(taskTemplateId);
    return { id: taskTemplateId };
  }

  static async delete(taskTemplateId, membership, uid) {
    const taskTemplate = await TaskTemplate.getOne(taskTemplateId);
    if (!taskTemplate) throw ApplicationError(404);
    if (membership === 'Vice' && uid !== taskTemplate.creatorId) throw new ApplicationError(403);

    await TaskTemplateItemRepository.delete(taskTemplateId);
    const deleteTaskTemplate = await TaskTemplate.delete(taskTemplateId);
    if (!deleteTaskTemplate) throw new ApplicationError(400);
  }
}

module.exports = TaskTemplateRepository;
