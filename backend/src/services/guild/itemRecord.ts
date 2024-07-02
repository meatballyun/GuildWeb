import { Item } from '../../types/guild/item';
import { ItemModel } from '../../models/guild/item';
import { ItemRecordModel } from '../../models/guild/itemRecord';

export class ItemRecordService {
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

  static async deleteAllByMission(missionId: number) {
    const items = await ItemModel.getAll(missionId);
    await Promise.all(
      items.map(async ({ id: itemId }) => {
        await ItemRecordModel.deleteAllByItem(itemId);
      })
    );
  }

  static async deleteAllByMissionAndUser(missionId: number, AdventurerId: number) {
    const items = await ItemModel.getAll(missionId);
    if (!items) return;
    await Promise.all(
      items.map(async ({ id: itemId }) => {
        await ItemRecordModel.deleteAllByItemAndUser(itemId, AdventurerId);
      })
    );
  }
}
