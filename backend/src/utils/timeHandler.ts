// @ts-nocheck
import { ApplicationError } from './error/applicationError';

export const formatTimestamp = (time) => {
  return `${time.getFullYear()}/${time.getMonth() + 1}/${time.getDate()} ${time.getHours()}:${time.getMinutes()}:${time.getDate()}`;
};

export const timeHandle = (startTime, endTime) => {
  const initiationTime = new Date(startTime);
  const deadline = new Date(endTime);
  if (initiationTime > deadline) throw new ApplicationError(409);
  return { initiationTime: formatTimestamp(initiationTime), deadline: formatTimestamp(deadline) };
};
