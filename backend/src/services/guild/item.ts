import { ApplicationError } from '../../utils/error/applicationError';
import { Item } from '../../types/guild/item';
import { TemplateItem } from '../../types/guild/missionTemplateItem';
import { ItemModel } from '../../models/guild/item';
import * as itemRecordService from './itemRecord';
import { executeTransaction } from '../../utils/executeTransaction';

export const getAll = async (missionId: number, AdventurerId: number, isAccepted: boolean) => {
  const items = await ItemModel.getAll(missionId);
  if (isAccepted) {
    const itemRecords = await itemRecordService.getAll(items, AdventurerId);
    return itemRecords;
  }
  if (items) return items;
};

export const create = async (items: Item[] | TemplateItem[], missionId: number) => {
  if (items?.length) {
    const contents = items.map(({ content }) => content);

    const newItemId = await ItemModel.createMany(missionId, contents);
    if (!newItemId) throw new ApplicationError(400);
  }
};

export const update = async (items: Item[] | TemplateItem[], missionId: number) => {
  if (!items) await ItemModel.deleteAll(missionId);
  else {
    const updateItemIds: { id: number; content: string }[] = [];
    const createItemContents: string[] = [];
    const deleteItemIds: number[] = [];

    await Promise.all(
      items.map(async ({ id, content }) => {
        if (content) {
          id ? updateItemIds.push(id, content) : createItemContents.push(content);
        } else {
          deleteItemIds.push(id);
        }
      })
    );
    await executeTransaction(async () => {
      const newItemId = await ItemModel.createMany(missionId, createItemContents);
      if (!newItemId) throw new ApplicationError(400);

      await ItemModel.updateMany(updateItemIds);
      await ItemModel.deleteManyById(deleteItemIds);
    });
  }
};

export const remove = async (missionId: number) => {
  const items = await ItemModel.getAll(missionId);
  if (!items) return;
  await itemRecordService.deleteAllByMission(missionId);
  await ItemModel.deleteAll(missionId);
};
