const Task = require('../../models/guild/task.model');
const ItemRecord = require('../../models/guild/itemRecord.model');
const Adventurer = require('../../models/guild/adventurer.model');
const User = require('../../models/user/user.model');
const ApplicationError = require('../../utils/error/applicationError.js');
const { timeHandle } = require('../../utils/timeHandler.js');
const AdventurerRepository = require('../../repositories/guild/adventurer.repository.js');
const ItemRepository = require('../../repositories/guild/item.repository.js');
const ItemRecordRepository = require('../../repositories/guild/itemRecord.repository.js');

class TaskRepository {
  static async getAll({ gid: guildId }, { q: query }, uid) {
    const tasks = query
      ? await Task.getAllByGuildAndName(guildId, query)
      : await Task.getAllByGuild(guildId);
    if (tasks) {
      const data = await Promise.all(
        tasks.map(async ({ id, creator, name, type, status, accepted }) => {
          const isAccepted = await AdventurerRepository.isAdventurer(id, uid);
          return { id, creator, name, type, status, accepted, isAccepted };
        })
      );
      return data;
    }
  }

  static async getOne({ tid: taskId }, uid) {
    const task = await Task.getOne(taskId);
    if (task) {
      const { id, name, imageUrl } = await User.getOneById(task.creatorId);
      const creator = { id, name, imageUrl };
      const adventurers = await AdventurerRepository.getAdventurerInfo(taskId);
      const isAccepted = await AdventurerRepository.isAdventurer(taskId, uid);
      const items = await ItemRepository.getAll(taskId, uid, isAccepted);
      return { creator, ...task, adventurers, items, isAccepted };
    }
    throw new ApplicationError(409);
  }

  static async create({ initiationTime, deadline, items, ...otherData }, guildId, uid) {
    const time = await timeHandle(initiationTime, deadline);
    const newTaskId = await Task.create(uid, guildId, time, otherData);
    if (newTaskId) {
      ItemRepository.create(items, newTaskId);
      return { id: newTaskId };
    }
    throw new ApplicationError(400);
  }

  static async accept({ tid: taskId }, uid) {
    const task = await Task.getOne(taskId);
    if (!task) throw new ApplicationError(404);
    const isAccepted = await AdventurerRepository.isAdventurer(taskId, uid);
    if (isAccepted) throw new ApplicationError(409);
    if (task.accepted === 'Max Accepted') throw new ApplicationError(409);
    const adventurer = await Adventurer.create(taskId, uid);
    if (!adventurer) throw new ApplicationError(400);
  }

  static async submit({ tid: taskId }, uid) {
    const task = await Task.getOne(taskId);
    if (!task) throw new ApplicationError(404);
    const adventurer = await Adventurer.getOne(taskId, uid);
    if (!adventurer) throw new ApplicationError(409);

    const currentTime = new Date();
    const initiationTime = new Date(task.initiationTime);
    const deadline = new Date(task.deadline);
    if (currentTime < initiationTime || currentTime > deadline) throw new ApplicationError(409);

    const result = await Adventurer.update(taskId, uid, 'Completed', currentTime);
    if (!result) throw new ApplicationError(400);
  }

  static async abandon({ tid: taskId }, uid) {
    const task = await Task.getOne(taskId);
    if (!task) throw new ApplicationError(404);
    const isAccepted = await AdventurerRepository.isAdventurer(taskId, uid);
    if (!isAccepted) throw new ApplicationError(409);

    await Adventurer.deleteByTaskAndUser(taskId, uid);
    await ItemRecordRepository.deleteAllByTaskAndUser(taskId, uid);
  }

  static async complete({ tid: taskId }, { membership }, uid) {
    const task = await Task.getOne(taskId);
    if (!task) throw ApplicationError(404);
    if (membership === 'Vice' && uid !== task.creatorId) throw new ApplicationError(403);

    await AdventurerRepository.updateStatusByTaskComplete(taskId);
    const result = await Task.updateStatus(taskId, 'Completed');
    if (!result) throw new ApplicationError(400);
  }

  static async fail({ tid: taskId }, { membership }, uid) {
    const task = await Task.getOne(taskId);
    if (!task) throw ApplicationError(404);
    if (membership === 'Vice' && uid !== task.creatorId) throw new ApplicationError(403);

    await AdventurerRepository.updateStatusByTaskFail(taskId);
    const result = await Task.updateStatus(taskId, 'Expired');
    if (!result) throw new ApplicationError(400);
  }

  static async clickCheckboxForItemRecord(itemRecordId) {
    const itemRecord = await ItemRecord.getOne(itemRecordId);
    if (itemRecord) {
      if (itemRecord.status) {
        await ItemRecord.update(itemRecordId, false);
      } else {
        await ItemRecord.update(itemRecordId, true);
      }
    } else throw new ApplicationError(404);
  }

  // prettier-ignore
  static async update({ initiationTime, deadline, items, ...otherData }, { tid: taskId }, { membership }, uid) {
    const task = await Task.getOne(taskId);
    if (!task) throw new ApplicationError(404);
    if (membership === 'Vice' && uid !== task.creatorId) throw new ApplicationError(403);

    const time = await timeHandle(initiationTime, deadline);

    const result = await Task.update(taskId, time, otherData);
    if (!result) throw new ApplicationError(400);

    await Adventurer.deleteByTask(taskId);
    await ItemRecordRepository.deleteAllByTask(taskId);
    await ItemRepository.update(items, taskId);

    return { id: taskId };
  }

  static async cancel({ tid: taskId }, { membership }, uid) {
    const task = await Task.getOne(taskId);
    if (!task) throw ApplicationError(404);
    if (membership === 'Vice' && uid !== task.creatorId) throw new ApplicationError(403);

    await Adventurer.deleteByTask(taskId);
    await ItemRecordRepository.deleteAllByTask(taskId);

    const result = await Task.updateStatus(taskId, 'Cancelled');
    if (!result) throw new ApplicationError(400);
  }

  static async restore({ tid: taskId }, { membership }, uid) {
    const task = await Task.getOne(taskId);
    if (!task) throw ApplicationError(404);
    if (membership === 'Vice' && uid !== task.creatorId) throw new ApplicationError(403);

    const currentTime = new Date();
    const initiationTime = new Date(initiationTime);
    if (currentTime > initiationTime) throw new ApplicationError(409);

    const result = await Task.updateStatus(taskId, 'Established');
    if (!result) throw new ApplicationError(400);
  }

  static async delete({ tid: taskId }, { membership }, uid) {
    const task = await Task.getOne(taskId);
    if (!task) throw new ApplicationError(404);
    if (membership === 'Vice' && uid !== task.creatorId) throw new ApplicationError(403);

    await Adventurer.deleteByTask(taskId);
    await ItemRepository.delete(taskId);
    const result = await Task.delete(taskId);
    if (!result) throw new ApplicationError(409);
  }
}

module.exports = TaskRepository;
