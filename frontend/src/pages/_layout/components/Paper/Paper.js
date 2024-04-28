import { classNames } from '../../../../utils';
import './styles.css';

export const Paper = ({ children, className, row, ...props }) => {
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
