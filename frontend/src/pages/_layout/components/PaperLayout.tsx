import { classNames } from '../../../utils';
import { Paper, PaperProps } from './Paper';

interface ItemProps {
  className?: string;
  children: React.ReactNode;
}

const Title = ({ className, children }: ItemProps) => (
  <div
    className={classNames(
      className,
      'mb-4 text-center text-heading-h1 text-primary-500'
    )}
  >
    {children}
  </div>
);

const Content = ({ children, className }: ItemProps) => {
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

export const PaperLayout = ({
  row = true,
  children,
  className,
  ...props
}: PaperProps) => {
  return (
    <Paper
      row={row}
      {...props}
      className={classNames('flex flex-col', className)}
    >
      {children}
    </Paper>
  );
};

PaperLayout.Title = Title;
PaperLayout.Content = Content;
