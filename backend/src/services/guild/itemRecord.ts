import { Item } from '../../types/guild/item';
import { ItemModel, ItemRecordModel } from '../../models';
import { ItemRecord } from '../../types/guild/itemRecord';

export const getAll = async (items: Item[], AdventurerId: number) => {
  if (!items?.length) return;
  const itemIds = items.map(({ id }) => id);
  const data = await ItemRecordModel.getAllByManyItemAndUser(itemIds, AdventurerId);
  return data;
};

export const create = async (items: Item[], AdventurerId: number) => {
  if (!items?.length) return;
  const itemIds = items.map(({ id }) => id);
  await ItemRecordModel.createMany(itemIds, AdventurerId);
};

export const deleteAllByMission = async (missionId: number) => {
  const items = await ItemModel.getAll(missionId);
  if (!items?.length) return;
  const itemIds = items.map(({ id: itemId }) => {
    return itemId;
  });
  await ItemRecordModel.deleteAllByManyItems(itemIds);
};

export const deleteAllByMissionAndUser = async (missionId: number, AdventurerId: number) => {
  const items = await ItemModel.getAll(missionId);
  if (!items?.length) return;
  const itemIds = items.map(({ id: itemId }) => {
    return itemId;
  });
  await ItemRecordModel.deleteAllByManyItemAndUser(itemIds, AdventurerId);
};
