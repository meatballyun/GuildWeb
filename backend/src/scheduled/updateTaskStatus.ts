import { TaskModel } from '../models/guild/task.model';

const updateTaskStatus = async () => {
  await TaskModel.checkInitiationTimeEvent();
  await TaskModel.checkDeadlineEvent();
};

export default updateTaskStatus;
