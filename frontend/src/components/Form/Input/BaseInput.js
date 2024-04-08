import { classNames } from '../../../utils';
import './styles.css';

export const BaseInput = ({
  onChange,
  className,
  inputClassName,
  value,
  ...props
}) => {
  return (
    <div className={classNames('input_container', className)}>
      <input
        {...props}
        className={inputClassName}
        value={value ?? ''}
        onChange={(e) => onChange?.(e.target.value)}
      />
    </div>
  );
};
