const task = new (require('../controllers/guild/taskControllers'))();
const taskTemplate = new (require('../controllers/guild/taskTemplateControllers'))();
const INTERVAL = 5 * 60 * 1000;

const taskScheduler = {
  start: () => {
    taskTemplate.autoBuildTask();
    task.autoUpdateStatus();    
    setInterval(taskTemplate.autoBuildTask, INTERVAL);
    setInterval(task.autoUpdateStatus, INTERVAL);
  }
};

module.exports = taskScheduler;