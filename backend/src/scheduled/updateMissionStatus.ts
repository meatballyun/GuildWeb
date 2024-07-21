import { MissionModel } from '../models/guild/mission';

export const updateMissionStatus = async () => {
  await MissionModel.checkInitiationTimeEvent();
  await MissionModel.checkDeadlineEvent();
};
