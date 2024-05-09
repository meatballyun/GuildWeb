const Task = require('../../models/guild/task.model.js');
const Item = require('../../models/guild/item.model.js');
const ItemRecord = require('../../models/guild/itemRecord.model.js');
const Adventurer = require('../../models/guild/adventurer.model.js');
const User = require('../../models/user/user.model.js');
const ApplicationError = require('../../utils/error/applicationError.js');

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
    await Promise.all(
      items.map(async ({ id: itemId }) => {
        await ItemRecord.deleteAllByItemAndUser(itemId, AdventurerId);
      })
    );
  }
}

module.exports = ItemRecordRepository;
