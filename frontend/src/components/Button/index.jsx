import { classNames } from '../../utils';
import './styles.css';

export const Button = ({
  className,
  prefix,
  suffix,
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
      {prefix}
      {children}
      {suffix}
    </button>
  );
};
