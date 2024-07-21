import { updateMissionStatus } from './updateMissionStatus';
import { buildMissionByMissionTemplates } from './buildMission';
const INTERVAL = 60 * 1000;

export const missionScheduler = {
  start: () => {
    setInterval(buildMissionByMissionTemplates, INTERVAL);
    setInterval(updateMissionStatus, INTERVAL);
  },
};
