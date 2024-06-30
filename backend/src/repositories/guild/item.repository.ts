import { ApplicationError } from '../../utils/error/applicationError';
import { Item } from '../../types/guild/item';
import { ItemModel } from '../../models/guild/item.model';
import { ItemRecordRepository } from '../../repositories/guild/itemRecord.repository';
import { TemplateItem } from '../../types/guild/taskTemplateItem';

export class ItemRepository {
  static async getAll(taskId: number, AdventurerId: number, isAccepted: boolean) {
    const items = await ItemModel.getAll(taskId);
    if (isAccepted) {
      const itemRecords = await ItemRecordRepository.getAll(items, AdventurerId);
      return itemRecords;
    }
    if (items) return items;
  }

  static async create(items: Item[] | TemplateItem[], taskId: number) {
    if (items) {
      await Promise.all(
        items.map(async ({ content }) => {
          const newItemId = await ItemModel.create(taskId, content);
          if (!newItemId) throw new ApplicationError(400);
        })
      );
    }
  }

  static async update(items: Item[] | TemplateItem[], taskId: number) {
    if (!items) await ItemModel.deleteAll(taskId);
    else {
      await Promise.all(
        items.map(async ({ id: itemId, content }) => {
          if (content) {
            itemId ? await ItemModel.update(itemId, content) : await ItemModel.create(taskId, content);
          } else {
            await ItemModel.delete(itemId);
          }
        })
      );
    }
  }

  static async delete(taskId: number) {
    const items = await ItemModel.getAll(taskId);
    if (!items) return;
    await ItemRecordRepository.deleteAllByTask(taskId);
    await ItemModel.deleteAll(taskId);
  }
}
