import { ApplicationError } from './error/applicationError';

export const formatTimestamp = (time: Date | string): string => {
  let dateString: string;

  if (time instanceof Date) {
    dateString = time.toISOString();
  } else if (typeof time === 'string') {
    dateString = time;
  } else {
    throw new ApplicationError(400);
  }
  const formattedDateStr = dateString.replace(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}).*$/, '$1/$2/$3 $4:$5:$6');
  return formattedDateStr;
};

export const timeHandle = (startTime: Date | string, endTime: Date | string) => {
  const initiationTime = new Date(startTime);
  const deadline = new Date(endTime);
  if (initiationTime > deadline) throw new ApplicationError(409);
  return { initiationTime: formatTimestamp(startTime), deadline: formatTimestamp(deadline) };
};
