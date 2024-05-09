const Item = require('../../models/guild/item.model.js');
const ApplicationError = require('../../utils/error/applicationError.js');
const ItemRecordRepository = require('../../repositories/guild/itemRecord.repository.js');

class ItemRepository {
  static async getAll(taskId, AdventurerId, isAccepted) {
    const items = await Item.getAll(taskId);
    if (isAccepted) {
      const itemRecords = await ItemRecordRepository.getAll(items, AdventurerId);
      return itemRecords;
    }
    if (items) return items;
  }

  static async create(items, taskId) {
    if (items) {
      await Promise.all(
        items.map(async ({ content }) => {
          const newItemId = await Item.create(taskId, content);
          if (!newItemId) throw new ApplicationError(400);
        })
      );
    }
  }

  static async update(items, taskId) {
    if (!items) await Item.deleteAll(taskId);
    else {
      await Promise.all(
        items.map(async ({ id: itemId, content }) => {
          if (content) {
            itemId ? await Item.update(itemId, content) : await Item.create(taskId, content);
          } else {
            await Item.delete(itemId);
          }
        })
      );
    }
  }

  static async delete(taskId) {
    const items = await Item.getAll(taskId);
    if (!items) return;
    await ItemRecordRepository.deleteAllByTask(taskId);
    await Item.deleteAll(taskId);
  }
}

module.exports = ItemRepository;
