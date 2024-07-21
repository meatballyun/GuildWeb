const getCurrentDate = (date: Date | string) => {
  if (!(date instanceof Date)) return new Date(date);
  return date;
};

export const formateDate = (date: Date | string) => {
  const currentDate = getCurrentDate(date);
  if (isNaN(currentDate as any)) return '';
  return currentDate.toLocaleDateString();
};

export const formateIsoDate = (date: Date | string) => {
  const currentDate = getCurrentDate(date);
  if (isNaN(currentDate as any)) return '';
  return currentDate
    .toLocaleDateString()
    .split('/')
    .map((value) => (value[1] ? value : `0${value}`))
    .join('-');
};

const getDateString = (date: Date | string) => {
  const currentDate = getCurrentDate(date);
  return `${currentDate.getFullYear()}/${currentDate.getMonth() + 1}/${currentDate.getDate()}`;
};

export const startOfDate = (date: Date | string) => {
  return new Date(`${getDateString(date)} 00:00:00`);
};

export const endOfDate = (date: Date | string) => {
  return new Date(`${getDateString(date)} 23:59:59`);
};
