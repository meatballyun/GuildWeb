const TemplateItem = require('../../models/guild/taskTemplateItem.model');
const ApplicationError = require('../../utils/error/applicationError.js');

class TaskTemplateItemRepository {
  static async getAll(taskTemplateId) {
    const templateItems = await TemplateItem.getAll(taskTemplateId);
    if (!templateItems) return;

    const items = await Promise.all(
      templateItems.map(async ({ id, content }) => {
        return { id, content };
      })
    );
    return items;
  }

  static async create(items, templateId) {
    if (items) {
      await Promise.all(
        items.map(async ({ content }) => {
          const newTemplateItemId = await TemplateItem.create(templateId, content);
          if (!newTemplateItemId) throw new ApplicationError(400);
        })
      );
    }
  }
  static async delete(taskTemplateId) {
    const templateItems = await TemplateItem.getAll(taskTemplateId);
    if (templateItems) await TemplateItem.deleteByTaskTemplate(taskTemplateId);
  }
}

module.exports = TaskTemplateItemRepository;
