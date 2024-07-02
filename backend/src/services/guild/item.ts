import { ApplicationError } from '../../utils/error/applicationError';
import { Item } from '../../types/guild/item';
import { ItemModel } from '../../models/guild/item';
import * as itemRecordService from './itemRecord';
import { TemplateItem } from '../../types/guild/missionTemplateItem';

export const getAll = async (missionId: number, AdventurerId: number, isAccepted: boolean) => {
  const items = await ItemModel.getAll(missionId);
  if (isAccepted) {
    const itemRecords = await itemRecordService.getAll(items, AdventurerId);
    return itemRecords;
  }
  if (items) return items;
};

export const create = async (items: Item[] | TemplateItem[], missionId: number) => {
  if (items) {
    await Promise.all(
      items.map(async ({ content }) => {
        const newItemId = await ItemModel.create(missionId, content);
        if (!newItemId) throw new ApplicationError(400);
      })
    );
  }
};

export const update = async (items: Item[] | TemplateItem[], missionId: number) => {
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
};

export const remove = async (missionId: number) => {
  const items = await ItemModel.getAll(missionId);
  if (!items) return;
  await itemRecordService.deleteAllByMission(missionId);
  await ItemModel.deleteAll(missionId);
};
