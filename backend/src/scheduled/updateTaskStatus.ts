import { TaskModel } from '../models/guild/task';

const updateTaskStatus = async () => {
  await TaskModel.checkInitiationTimeEvent();
  await TaskModel.checkDeadlineEvent();
};

export default updateTaskStatus;
