import { ApplicationError } from './error/applicationError';

export const formatTimestamp = (time: Date | string) => {
  if (typeof time === 'string') time = new Date(time);
  return `${time.getFullYear()}/${time.getMonth() + 1}/${time.getDate()} ${time.getHours()}:${time.getMinutes()}:${time.getDate()}`;
};

export const timeHandle = (startTime: Date | string, endTime: Date | string) => {
  const initiationTime = new Date(startTime);
  const deadline = new Date(endTime);
  if (initiationTime > deadline) throw new ApplicationError(409);
  return { generationTime: formatTimestamp(initiationTime), deadline: formatTimestamp(deadline) };
};
