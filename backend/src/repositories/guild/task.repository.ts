import { ApplicationError } from '../../utils/error/applicationError';
import { timeHandle } from '../../utils/timeHandler';
import { Membership } from '../../types/user/userGuildRelation';
import { Status, TaskTime, TaskInfo, Task } from '../../types/guild/task';
import { Item } from '../../types/guild/item';
import { UserModel } from '../../models/user/user.model';
import { TaskModel } from '../../models/guild/task.model';
import { ItemRecordModel } from '../../models/guild/itemRecord.model';
import { AdventurerModel } from '../../models/guild/adventurer.model';
import { ItemRepository } from '../../repositories/guild/item.repository';
import { ItemRecordRepository } from '../../repositories/guild/itemRecord.repository';
import { AdventurerRepository } from '../../repositories/guild/adventurer.repository';
import { TemplateItem } from '../../types/guild/taskTemplateItem';

interface TaskDetailed extends TaskTime, TaskInfo {
  items: Item[] | TemplateItem[];
}

export class TaskRepository {
  static async getAll({ gid: guildId }: { gid: number }, { q: query }: { q?: string }, uid: number) {
    const tasks = query ? await TaskModel.getAllByGuildAndName(guildId, query) : await TaskModel.getAllByGuild(guildId);
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

  static async getOne({ tid: taskId }: { tid: number }, uid: number) {
    const task = await TaskModel.getOne(taskId);
    if (task) {
      const user = await UserModel.getOneById(task.creatorId);
      if (!user) throw new ApplicationError(400);
      const { id, name, imageUrl } = user;
      const creator = { id, name, imageUrl };
      const adventurers = await AdventurerRepository.getAdventurerInfo(taskId);
      const isAccepted = await AdventurerRepository.isAdventurer(taskId, uid);
      const items = await ItemRepository.getAll(taskId, uid, isAccepted);
      return { creator, ...task, adventurers, items, isAccepted };
    }
    throw new ApplicationError(409);
  }

  static async create({ initiationTime, deadline, items, ...otherData }: TaskDetailed, guildId: number, uid: number) {
    const time = await timeHandle(initiationTime, deadline);
    const newTaskId = await TaskModel.create(uid, guildId, time, otherData);
    if (newTaskId) {
      ItemRepository.create(items, newTaskId);
      return { id: newTaskId };
    }
    throw new ApplicationError(400);
  }

  static async accept({ tid: taskId }: { tid: number }, uid: number) {
    const task = await TaskModel.getOne(taskId);
    if (!task) throw new ApplicationError(404);
    const isAccepted = await AdventurerRepository.isAdventurer(taskId, uid);
    if (isAccepted) throw new ApplicationError(409);
    if (task.accepted === 'max accepted') throw new ApplicationError(409);
    const adventurer = await AdventurerModel.create(taskId, uid);
    if (!adventurer) throw new ApplicationError(400);
  }

  static async submit({ tid: taskId }: { tid: number }, uid: number) {
    const task = await TaskModel.getOne(taskId);
    if (!task) throw new ApplicationError(404);
    const adventurer = await AdventurerModel.getOne(taskId, uid);
    if (!adventurer) throw new ApplicationError(409);

    const currentTime = new Date();
    const initiationTime = new Date(task.initiationTime);
    const deadline = new Date(task.deadline);
    if (currentTime < initiationTime || currentTime > deadline) throw new ApplicationError(409);

    const result = await AdventurerModel.update(taskId, uid, 'completed', currentTime);
    if (!result) throw new ApplicationError(400);
  }

  static async abandon({ tid: taskId }: { tid: number }, uid: number) {
    const task = await TaskModel.getOne(taskId);
    if (!task) throw new ApplicationError(404);
    const isAccepted = await AdventurerRepository.isAdventurer(taskId, uid);
    if (!isAccepted) throw new ApplicationError(409);

    await AdventurerModel.deleteByTaskAndUser(taskId, uid);
    await ItemRecordRepository.deleteAllByTaskAndUser(taskId, uid);
  }

  static async complete({ tid: taskId }: { tid: number }, membership: Membership, uid: number) {
    const task = await TaskModel.getOne(taskId);
    if (!task) throw new ApplicationError(404);
    if (membership === 'vice' && uid !== task.creatorId) throw new ApplicationError(403);

    await AdventurerRepository.updateStatusByTaskComplete(taskId);
    const result = await TaskModel.updateStatus(taskId, 'completed');
    if (!result) throw new ApplicationError(400);
  }

  static async fail({ tid: taskId }: { tid: number }, membership: Membership, uid: number) {
    const task = await TaskModel.getOne(taskId);
    if (!task) throw new ApplicationError(404);
    if (membership === 'vice' && uid !== task.creatorId) throw new ApplicationError(403);

    await AdventurerRepository.updateStatusByTaskFail(taskId);
    const result = await TaskModel.updateStatus(taskId, 'expired');
    if (!result) throw new ApplicationError(400);
  }

  static async clickCheckboxForItemRecord(itemRecordId: number) {
    const itemRecord = await ItemRecordModel.getOne(itemRecordId);
    if (itemRecord) {
      if (itemRecord.status) {
        await ItemRecordModel.update(itemRecordId, false);
      } else {
        await ItemRecordModel.update(itemRecordId, true);
      }
    } else throw new ApplicationError(404);
  }

  // prettier-ignore
  static async update({ initiationTime, deadline, items, ...otherData }: TaskDetailed, { tid: taskId }:{ tid: number }, membership: Membership, uid: number) {
    const task = await TaskModel.getOne(taskId);
    if (!task) throw new ApplicationError(404);
    if (membership === 'vice' && uid !== task.creatorId) throw new ApplicationError(403);

    const time = await timeHandle(initiationTime, deadline);

    const result = await TaskModel.updateDetail(taskId, time, otherData);
    if (!result) throw new ApplicationError(400);

    await AdventurerModel.deleteByTask(taskId);
    await ItemRecordRepository.deleteAllByTask(taskId);
    await ItemRepository.update(items, taskId);

    return { id: taskId };
  }

  static async cancel({ tid: taskId }: { tid: number }, membership: Membership, uid: number) {
    const task = await TaskModel.getOne(taskId);
    if (!task) throw new ApplicationError(404);
    if (membership === 'vice' && uid !== task.creatorId) throw new ApplicationError(403);

    await AdventurerModel.deleteByTask(taskId);
    await ItemRecordRepository.deleteAllByTask(taskId);

    const result = await TaskModel.updateStatus(taskId, 'cancelled');
    if (!result) throw new ApplicationError(400);
  }

  static async restore({ tid: taskId }: { tid: number }, membership: Membership, uid: number) {
    const task = await TaskModel.getOne(taskId);
    if (!task) throw new ApplicationError(404);
    if (membership === 'vice' && uid !== task.creatorId) throw new ApplicationError(403);

    const currentTime = new Date();
    const initiationTime = new Date(task.initiationTime);
    if (currentTime > initiationTime) throw new ApplicationError(409);

    const result = await TaskModel.updateStatus(taskId, 'established');
    if (!result) throw new ApplicationError(400);
  }

  static async delete({ tid: taskId }: { tid: number }, membership: Membership, uid: number) {
    const task = await TaskModel.getOne(taskId);
    if (!task) throw new ApplicationError(404);
    if (membership === 'vice' && uid !== task.creatorId) throw new ApplicationError(403);

    await AdventurerModel.deleteByTask(taskId);
    await ItemRepository.delete(taskId);
    const result = await TaskModel.delete(taskId);
    if (!result) throw new ApplicationError(409);
  }
}
