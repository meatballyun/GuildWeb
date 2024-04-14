import { classNames } from '../../../utils';
import '../styles.css';

export const BaseInput = ({
  onChange,
  className,
  inputClassName,
  value,
  ...props
}) => {
  return (
    <input
      {...props}
      className={classNames('input_container', className)}
      value={value ?? ''}
      onChange={(e) => onChange?.(e.target.value)}
    />
  );
};
