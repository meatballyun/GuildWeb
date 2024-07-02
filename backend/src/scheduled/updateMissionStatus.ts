import { MissionModel } from '../models/guild/mission';

const updateMissionStatus = async () => {
  await MissionModel.checkInitiationTimeEvent();
  await MissionModel.checkDeadlineEvent();
};

export default updateMissionStatus;
