// @ts-nocheck

import Adventurer from '../../models/guild/adventurer.model';
import { UserModel } from '../../models/user/user.model';
import { ApplicationError } from '../../utils/error/applicationError';
import UserInfoRepository from '../../repositories/user/userInfo.repository';

class AdventurerRepository {
  static async isAdventurer(taskId, uid) {
    const adventurer = await Adventurer.getOne(taskId, uid);
    return adventurer ? true : false;
  }

  static async getAdventurerInfo(taskId) {
    const adventurers = await Adventurer.getAllByTask(taskId);
    if (!adventurers) return;
    const adventurerInfo = await Promise.all(
      adventurers.map(async ({ userId, status }) => {
        const { id, name, imageUrl } = await UserModel.getOneById(userId);
        return { id, name, imageUrl, status };
      })
    );
    return adventurerInfo;
  }

  static async updateStatusByTaskComplete(taskId) {
    const adventurers = await Adventurer.getAllByTask(taskId);
    if (!adventurers) throw new ApplicationError(409);
    await Promise.all(
      adventurers.map(async ({ userId }) => {
        const adventurer = await Adventurer.getOne(taskId, userId);
        if (adventurer.status != 'Completed') {
          await Adventurer.updateStatus(taskId, userId, 'Failed');
          await UserInfoRepository.updateExp(userId, -1);
        } else {
          await UserInfoRepository.updateExp(userId, 1);
        }
      })
    );
  }

  static async updateStatusByTaskFail(taskId) {
    const adventurers = await Adventurer.getAllByTask(taskId);
    if (!adventurers) throw new ApplicationError(409);
    await Promise.all(
      adventurers.map(async ({ userId }) => {
        await Adventurer.updateStatus(taskId, userId, 'Failed');
        await UserInfoRepository.updateExp(userId, -1);
      })
    );
  }
}

export default AdventurerRepository;
