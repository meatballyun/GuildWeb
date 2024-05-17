// @ts-nocheck
import updateTaskStatus from './updateTaskStatus';
import buildTaskByTaskTemplates from './buildTask';
const INTERVAL = 5 * 60 * 1000;

const taskScheduler = {
  start: () => {
    setInterval(buildTaskByTaskTemplates, INTERVAL);
    setInterval(updateTaskStatus, INTERVAL);
  },
};

export default taskScheduler;
