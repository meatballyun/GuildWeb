import { Item } from '../../types/guild/item';
import { ItemModel, ItemRecordModel } from '../../models';

export const getAll = async (items: Item[], AdventurerId: number) => {
  if (!items) return;
  const data = await Promise.all(
    items.map(async ({ id: itemId }) => {
      const itemRecords = await ItemRecordModel.getAllByItemAndUser(itemId, AdventurerId);
      return itemRecords;
    })
  );
  return data;
};

export const deleteAllByMission = async (missionId: number) => {
  const items = await ItemModel.getAll(missionId);
  await Promise.all(
    items.map(async ({ id: itemId }) => {
      await ItemRecordModel.deleteAllByItem(itemId);
    })
  );
};

export const deleteAllByMissionAndUser = async (missionId: number, AdventurerId: number) => {
  const items = await ItemModel.getAll(missionId);
  if (!items) return;
  await Promise.all(
    items.map(async ({ id: itemId }) => {
      await ItemRecordModel.deleteAllByItemAndUser(itemId, AdventurerId);
    })
  );
};
