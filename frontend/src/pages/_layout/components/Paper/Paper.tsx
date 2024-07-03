import { classNames } from '../../../../utils';
import './styles.css';

export interface PaperProps extends React.HTMLAttributes<HTMLDivElement> {
  row?: boolean;
}

export const Paper = ({ children, className, row, ...props }: PaperProps) => {
  return (
    <div
      {...props}
      className={classNames(
        'layout-paper',
        row && 'layout-paper--row',
        className
      )}
    >
      {children}
    </div>
  );
};
