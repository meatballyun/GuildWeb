import updateMissionStatus from './updateMissionStatus';
import buildMissionByMissionTemplates from './buildMission';
const INTERVAL = 5 * 60 * 1000;

const missionScheduler = {
  start: () => {
    setInterval(buildMissionByMissionTemplates, INTERVAL);
    setInterval(updateMissionStatus, INTERVAL);
  },
};

export default missionScheduler;
