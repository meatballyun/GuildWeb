import { ApplicationError } from '../../utils/error/applicationError';
import { MissionTemplateItemModel } from '../../models/guild/missionTemplateItem';

export interface Item {
  id: number;
  content: string;
}

export class MissionTemplateItemService {
  static async getAll(missionTemplateId: number) {
    const templateItems = await MissionTemplateItemModel.getAll(missionTemplateId);
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
          const newTemplateItemId = await MissionTemplateItemModel.create(templateId, content);
          if (!newTemplateItemId) throw new ApplicationError(400);
        })
      );
    }
  }
  static async delete(missionTemplateId: number) {
    const templateItems = await MissionTemplateItemModel.getAll(missionTemplateId);
    if (templateItems) await MissionTemplateItemModel.deleteByMissionTemplate(missionTemplateId);
  }
}
