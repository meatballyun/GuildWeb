import { ApplicationError } from '../../utils/error/applicationError';
import { TaskTemplateItemModel } from '../../models/guild/taskTemplateItem';

export interface Item {
  id: number;
  content: string;
}

export class TaskTemplateItemService {
  static async getAll(taskTemplateId: number) {
    const templateItems = await TaskTemplateItemModel.getAll(taskTemplateId);
    if (!templateItems) return;

    const items = await Promise.all(
      templateItems.map(async ({ id, content }) => {
        return { id, content };
      })
    );
    return items;
  }

  static async create(items: Item[], templateId: number) {
    if (items) {
      await Promise.all(
        items.map(async ({ content }: { content: string }) => {
          const newTemplateItemId = await TaskTemplateItemModel.create(templateId, content);
          if (!newTemplateItemId) throw new ApplicationError(400);
        })
      );
    }
  }
  static async delete(taskTemplateId: number) {
    const templateItems = await TaskTemplateItemModel.getAll(taskTemplateId);
    if (templateItems) await TaskTemplateItemModel.deleteByTaskTemplate(taskTemplateId);
  }
}
