import { ApplicationError } from '../../utils/error/applicationError';
import { Item } from '../../types/guild/item';
import { TemplateItem } from '../../types/guild/missionTemplateItem';
import { ItemModel } from '../../models/guild/item';
import * as itemRecordService from './itemRecord';
import { executeTransaction } from '../../utils/executeTransaction';

export const getAll = async (missionId: number, AdventurerId: number, isAccepted: boolean) => {
  const items = await ItemModel.getAll(missionId);
  if (isAccepted && items?.length) {
    const itemRecords = await itemRecordService.getAll(items, AdventurerId);
    return itemRecords;
  }
  if (items?.length) return items;
};

export const create = async (items: Item[] | TemplateItem[], missionId: number) => {
  if (items?.length) {
    const contents = items.map(({ content }) => content);

    const newItemId = await ItemModel.createMany(missionId, contents);
    if (!newItemId) throw new ApplicationError(400);
  }
};

export const update = async (items: Item[] | TemplateItem[], missionId: number) => {
  if (!items?.length) await ItemModel.deleteAll(missionId);
  else {
    const updateItems: { id: number; content: string }[] = [];
    const createItemContents: string[] = [];
    const deleteItemIds: number[] = [];
    await Promise.all(
      items.map(async ({ id, content }) => {
        if (content) {
          id ? updateItems.push({ id, content }) : createItemContents.push(content);
        } else {
          deleteItemIds.push(id);
        }
      })
    );

    await executeTransaction(async () => {
      if (createItemContents?.length) {
        const newItemId = await ItemModel.createMany(missionId, createItemContents);
        if (!newItemId) throw new ApplicationError(400);
      }
      if (updateItems?.length) await ItemModel.updateMany(updateItems);
      if (deleteItemIds?.length) await ItemModel.deleteManyById(deleteItemIds);
    });
  }
};

export const remove = async (missionId: number) => {
  const items = await ItemModel.getAll(missionId);
  if (!items?.length) return;
  await itemRecordService.deleteAllByMission(missionId);
  await ItemModel.deleteAll(missionId);
};
