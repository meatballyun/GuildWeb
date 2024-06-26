import { forwardRef } from 'react';
import { classNames } from '../../../utils';
import { BaseInput } from './BaseInput';

export const Input = forwardRef(
  (
    {
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
      name,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        {...props}
        className={classNames(
          'text-paragraph-p2',
          classNameProp,
          type === 'underline' && 'border-b border-currentColor pb-1',
          error && 'text-red'
        )}
      >
        <BaseInput
          name={name}
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
  }
);
