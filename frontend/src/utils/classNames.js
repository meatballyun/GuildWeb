export const classNames = (...className) =>
  className.flatMap((data) => (data ? [data] : [])).join(' ');
