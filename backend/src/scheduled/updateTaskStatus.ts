// @ts-nocheck
import Task from '../models/guild/task.model';

const updateTaskStatus = async () => {
  await Task.checkInitiationTimeEvent();
  await Task.checkDeadlineEvent();
};

export default updateTaskStatus;
