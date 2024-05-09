const Task = require('../models/guild/task.model');

const updateTaskStatus = async () => {
  await Task.checkInitiationTimeEvent();
  await Task.checkDeadlineEvent();
};

module.exports = updateTaskStatus;
