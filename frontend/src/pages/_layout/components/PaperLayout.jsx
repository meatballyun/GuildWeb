import { classNames } from '../../../utils';
import { Paper } from './Paper';

const Title = ({ className, children }) => (
  <div
    className={classNames(
      className,
      'mb-4 text-center text-heading-h1 text-primary-500'
    )}
  >
    {children}
  </div>
);

const Content = ({ children, className }) => {
  return (
    <div
      className={classNames(
        'flex h-0 flex-1 items-center justify-center',
        className
      )}
    >
      {children}
    </div>
  );
};

export const PaperLayout = ({ children, className, ...props }) => {
  return (
    <Paper row {...props} className={classNames('flex flex-col', className)}>
      {children}
    </Paper>
  );
};

PaperLayout.Title = Title;
PaperLayout.Content = Content;
