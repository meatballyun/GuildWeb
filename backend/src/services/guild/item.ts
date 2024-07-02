import { ApplicationError } from '../../utils/error/applicationError';
import { Item } from '../../types/guild/item';
import { ItemModel } from '../../models/guild/item';
import { ItemRecordService } from '../../services/guild/itemRecord';
import { TemplateItem } from '../../types/guild/missionTemplateItem';

export class ItemService {
  static async getAll(missionId: number, AdventurerId: number, isAccepted: boolean) {
    const items = await ItemModel.getAll(missionId);
    if (isAccepted) {
      const itemRecords = await ItemRecordService.getAll(items, AdventurerId);
      return itemRecords;
    }
    if (items) return items;
  }

  static async create(items: Item[] | TemplateItem[], missionId: number) {
    if (items) {
      await Promise.all(
        items.map(async ({ content }) => {
          const newItemId = await ItemModel.create(missionId, content);
          if (!newItemId) throw new ApplicationError(400);
        })
      );
    }
  }

  static async update(items: Item[] | TemplateItem[], missionId: number) {
    if (!items) await ItemModel.deleteAll(missionId);
    else {
      await Promise.all(
        items.map(async ({ id: itemId, content }) => {
          if (content) {
            itemId ? await ItemModel.update(itemId, content) : await ItemModel.create(missionId, content);
          } else {
            await ItemModel.delete(itemId);
          }
        })
      );
    }
  }

  static async delete(missionId: number) {
    const items = await ItemModel.getAll(missionId);
    if (!items) return;
    await ItemRecordService.deleteAllByMission(missionId);
    await ItemModel.deleteAll(missionId);
  }
}
