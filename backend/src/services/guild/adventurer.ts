import { ApplicationError } from '../../utils/error/applicationError';
import { AdventurerModel } from '../../models';
import { userInfoService } from '../../services/user';

export const isAdventurer = async (missionId: number, uid: number) => {
  const adventurer = await AdventurerModel.getOne(missionId, uid);
  return adventurer ? true : false;
};

export const getAdventurerInfo = async (missionId: number) => {
  const adventurerInfos = await AdventurerModel.getAllByMissionId(missionId);
  return adventurerInfos;
};

export const updateStatusByMissionComplete = async (missionId: number) => {
  const adventurerInfos = await AdventurerModel.getAllByMissionId(missionId);
  if (!adventurerInfos) throw new ApplicationError(409);

  const failAdventurerIds: number[] = [];
  const completedAdventurerIds: number[] = [];

  await Promise.all(
    adventurerInfos.map(async ({ id, status }) => {
      if (status != 'completed') {
        failAdventurerIds.push(id);
      } else {
        completedAdventurerIds.push(id);
      }
    })
  );
  await AdventurerModel.updateStatusByManyUsers(missionId, failAdventurerIds, 'failed');
};

export const updateStatusByMissionFail = async (missionId: number) => {
  const adventurerInfos = await AdventurerModel.getAllByMissionId(missionId);
  if (!adventurerInfos?.length) throw new ApplicationError(409);

  const failAdventurerIds = await Promise.all(adventurerInfos.map(async ({ userId }) => userId));
  await AdventurerModel.updateStatusByManyUsers(missionId, failAdventurerIds, 'failed');
};
