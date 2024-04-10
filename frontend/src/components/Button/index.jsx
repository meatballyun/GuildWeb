import { classNames } from '../../utils';
import './styles.css';

export const Button = ({
  className,
  children,
  // sm, md, lg
  size = 'sm',
  // text, solid, solid
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
