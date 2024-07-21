import { classNames } from '../../utils';
import './styles.css';

export interface ButtonProps
  extends Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    'prefix' | 'type'
  > {
  size?: 'sm' | 'md' | 'lg';
  type?: 'text' | 'hollow' | 'solid';
  suffix?: React.ReactNode;
  prefix?: React.ReactNode;
  onClick?: () => void;
}

export const Button = ({
  className,
  prefix,
  suffix,
  children,
  size = 'sm',
  type = 'solid',
  ...props
}: ButtonProps) => {
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
