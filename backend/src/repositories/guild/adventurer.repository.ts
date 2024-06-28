import { ApplicationError } from '../../utils/error/applicationError';
import { User } from '../../types/user/user';
import { UserModel } from '../../models/user/user.model';
import { AdventurerModel } from '../../models/guild/adventurer.model';
import { UserInfoRepository } from '../../repositories/user/userInfo.repository';

export class AdventurerRepository {
  static async isAdventurer(taskId: number, uid: number) {
    const adventurer = await AdventurerModel.getOne(taskId, uid);
    return adventurer ? true : false;
  }

  static async getAdventurerInfo(taskId: number) {
    const adventurers = await AdventurerModel.getAllByTask(taskId);
    if (!adventurers) return;
    const adventurerInfo = await Promise.all(
      adventurers.map(async ({ userId, status }) => {
        const { id, name, imageUrl } = (await UserModel.getOneById(userId)) as User;
        return { id, name, imageUrl, status };
      })
    );
    return adventurerInfo;
  }

  static async updateStatusByTaskComplete(taskId: number) {
    const adventurers = await AdventurerModel.getAllByTask(taskId);
    if (!adventurers) throw new ApplicationError(409);
    await Promise.all(
      adventurers.map(async ({ userId }) => {
        const adventurer = await AdventurerModel.getOne(taskId, userId);
        if (adventurer?.status != 'completed') {
          await AdventurerModel.updateStatus(taskId, userId, 'failed');
          await UserInfoRepository.updateExp(userId, -1);
        } else {
          await UserInfoRepository.updateExp(userId, 1);
        }
      })
    );
  }

  static async updateStatusByTaskFail(taskId: number) {
    const adventurers = await AdventurerModel.getAllByTask(taskId);
    if (!adventurers) throw new ApplicationError(409);
    await Promise.all(
      adventurers.map(async ({ userId }) => {
        await AdventurerModel.updateStatus(taskId, userId, 'failed');
        await UserInfoRepository.updateExp(userId, -1);
      })
    );
  }
}
