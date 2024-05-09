const updateTaskStatus = require('./updateTaskStatus.js');
const buildTaskByTaskTemplates = require('./buildTask.js');
const INTERVAL = 5 * 60 * 1000;

const taskScheduler = {
  start: () => {
    setInterval(buildTaskByTaskTemplates, INTERVAL);
    setInterval(updateTaskStatus, INTERVAL);
  },
};

module.exports = taskScheduler;
