// @ts-nocheck
import Item from '../../models/guild/item.model';
import ItemRecord from '../../models/guild/itemRecord.model';

class ItemRecordRepository {
  static async getAll(items, AdventurerId) {
    if (!items) return;
    const data = await Promise.all(
      items.map(async ({ id: itemId }) => {
        const itemRecords = await ItemRecord.getAllByItemAndUser(itemId, AdventurerId);
        return itemRecords;
      })
    );
    return data;
  }

  static async deleteAllByTask(taskId) {
    const items = await Item.getAll(taskId);
    await Promise.all(
      items.map(async ({ id: itemId }) => {
        await ItemRecord.deleteAllByItem(itemId);
      })
    );
  }

  static async deleteAllByTaskAndUser(taskId, AdventurerId) {
    const items = await Item.getAll(taskId);
    if (!items) return;
    await Promise.all(
      items.map(async ({ id: itemId }) => {
        await ItemRecord.deleteAllByItemAndUser(itemId, AdventurerId);
      })
    );
  }
}

export default ItemRecordRepository;
