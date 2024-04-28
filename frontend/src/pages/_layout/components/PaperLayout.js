import { classNames } from '../../../utils';
import { Paper } from './Paper';

const Title = ({ children }) => (
  <div className="mb-4 text-center text-heading-h1 text-primary-500">
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

export const PaperLayout = ({ children }) => {
  return (
    <Paper row className="flex flex-col">
      {children}
    </Paper>
  );
};

PaperLayout.Title = Title;
PaperLayout.Content = Content;
