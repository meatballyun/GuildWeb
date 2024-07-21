import { classNames } from '../utils';

interface PillProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Pill = ({ children, className, ...props }: PillProps) => {
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
