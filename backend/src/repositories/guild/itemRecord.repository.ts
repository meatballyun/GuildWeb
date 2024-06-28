import { Item } from '../../types/guild/item';
import { ItemModel } from '../../models/guild/item.model';
import { ItemRecordModel } from '../../models/guild/itemRecord.model';

export class ItemRecordRepository {
  static async getAll(items: Item[], AdventurerId: number) {
    if (!items) return;
    const data = await Promise.all(
      items.map(async ({ id: itemId }) => {
        const itemRecords = await ItemRecordModel.getAllByItemAndUser(itemId, AdventurerId);
        return itemRecords;
      })
    );
    return data;
  }

  static async deleteAllByTask(taskId: number) {
    const items = await ItemModel.getAll(taskId);
    await Promise.all(
      items.map(async ({ id: itemId }) => {
        await ItemRecordModel.deleteAllByItem(itemId);
      })
    );
  }

  static async deleteAllByTaskAndUser(taskId: number, AdventurerId: number) {
    const items = await ItemModel.getAll(taskId);
    if (!items) return;
    await Promise.all(
      items.map(async ({ id: itemId }) => {
        await ItemRecordModel.deleteAllByItemAndUser(itemId, AdventurerId);
      })
    );
  }
}
