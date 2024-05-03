import { classNames } from '../utils';

export const Pill = ({ children, className, ...props }) => {
  return (
    <div
      className={classNames(
        'flex items-center rounded-full px-2 text-paragraph-p3 text-white shadow-sm',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
