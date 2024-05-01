export const formateDate = (date) => {
  let currentDate = date;
  if (!(currentDate instanceof Date)) currentDate = new Date(date);
  if (isNaN(currentDate)) return '';
  return currentDate.toLocaleDateString();
};

export const formateIsoDate = (date) => {
  let currentDate = date;
  if (!(currentDate instanceof Date)) currentDate = new Date(date);
  if (isNaN(currentDate)) return '';
  return currentDate
    .toLocaleDateString()
    .split('/')
    .map((value) => (value[1] ? value : `0${value}`))
    .join('-');
};
