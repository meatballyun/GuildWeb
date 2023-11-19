import { classNames } from '../../utils';
import './styles.css';

export const Button = ({
  className,
  children,
  size,
  type = 'solid',
  ...props
}) => {
  return (
    <button
      className={classNames(
        `button button-size--${size} button-type--${type}`,
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
