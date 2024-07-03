export const classNames = (...className: (string | undefined | false)[]) =>
  className.flatMap((data) => (data ? [data] : [])).join(' ');
