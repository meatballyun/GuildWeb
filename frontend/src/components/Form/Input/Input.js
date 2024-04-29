import { classNames } from '../../../utils';
import { BaseInput } from './BaseInput';

export const Input = ({
  label,
  value,
  onChange,
  error = false,
  noFill = false,
  disabled,
  type,
  inputType,
  className: classNameProp,
  inputClassName,
  placeholder,
  ...props
}) => {
  return (
    <div
      {...props}
      className={classNames(
        'text-paragraph-p2',
        classNameProp,
        type === 'underline' && 'border-b border-currentColor pb-1',
        error && 'text-red'
      )}
    >
      <BaseInput
        className={classNames(
          inputClassName,
          'rounded-sm px-2',
          !disabled && !noFill && 'bg-primary-100'
        )}
        placeholder={placeholder}
        type={inputType}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
    </div>
  );
};
