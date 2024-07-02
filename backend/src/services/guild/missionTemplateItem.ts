import { ApplicationError } from '../../utils/error/applicationError';
import { MissionTemplateItemModel } from '../../models/guild/missionTemplateItem';

export interface Item {
  id: number;
  content: string;
}

export const getAll = async (missionTemplateId: number) => {
  const templateItems = await MissionTemplateItemModel.getAll(missionTemplateId);
  if (!templateItems) return;

  const items = await Promise.all(
    templateItems.map(async ({ id, content }) => {
      return { id, content };
    })
  );
  return items;
};

export const create = async (items: Item[], templateId: number) => {
  if (items) {
    await Promise.all(
      items.map(async ({ content }: { content: string }) => {
        const newTemplateItemId = await MissionTemplateItemModel.create(templateId, content);
        if (!newTemplateItemId) throw new ApplicationError(400);
      })
    );
  }
};
export const remove = async (missionTemplateId: number) => {
  const templateItems = await MissionTemplateItemModel.getAll(missionTemplateId);
  if (templateItems) await MissionTemplateItemModel.deleteByMissionTemplate(missionTemplateId);
};
