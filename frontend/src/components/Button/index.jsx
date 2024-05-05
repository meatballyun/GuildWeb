import { classNames } from '../../utils';
import './styles.css';

/**
 *
 * @param {"sm"| "md"| "lg"} size
 * @param {"sm"| "md"| "lg"} type
 * @returns
 */
export const Button = ({
  className,
  prefix,
  suffix,
  children,
  text,
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
      {text}
      {suffix}
    </button>
  );
};
