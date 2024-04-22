export const formateDate = (date) => {
  let currentDate = date;
  if (!(currentDate instanceof Date)) currentDate = new Date(date);
  if (isNaN(currentDate)) return '';
  return currentDate.toISOString().slice(0, 10);
};
