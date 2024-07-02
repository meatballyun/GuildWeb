import { ApplicationError } from '../../utils/error/applicationError';
import { User } from '../../types/user/user';
import { UserModel } from '../../models/user/user';
import { AdventurerModel } from '../../models/guild/adventurer';
import { UserInfoService } from '../../services/user/userInfo';

export class AdventurerService {
  static async isAdventurer(missionId: number, uid: number) {
    const adventurer = await AdventurerModel.getOne(missionId, uid);
    return adventurer ? true : false;
  }

  static async getAdventurerInfo(missionId: number) {
    const adventurers = await AdventurerModel.getAllByMission(missionId);
    if (!adventurers) return;
    const adventurerInfo = await Promise.all(
      adventurers.map(async ({ userId, status }) => {
        const { id, name, imageUrl } = (await UserModel.getOneById(userId)) as User;
        return { id, name, imageUrl, status };
      })
    );
    return adventurerInfo;
  }

  static async updateStatusByMissionComplete(missionId: number) {
    const adventurers = await AdventurerModel.getAllByMission(missionId);
    if (!adventurers) throw new ApplicationError(409);
    await Promise.all(
      adventurers.map(async ({ userId }) => {
        const adventurer = await AdventurerModel.getOne(missionId, userId);
        if (adventurer?.status != 'completed') {
          await AdventurerModel.updateStatus(missionId, userId, 'failed');
          await UserInfoService.updateExp(userId, -1);
        } else {
          await UserInfoService.updateExp(userId, 1);
        }
      })
    );
  }

  static async updateStatusByMissionFail(missionId: number) {
    const adventurers = await AdventurerModel.getAllByMission(missionId);
    if (!adventurers) throw new ApplicationError(409);
    await Promise.all(
      adventurers.map(async ({ userId }) => {
        await AdventurerModel.updateStatus(missionId, userId, 'failed');
        await UserInfoService.updateExp(userId, -1);
      })
    );
  }
}
