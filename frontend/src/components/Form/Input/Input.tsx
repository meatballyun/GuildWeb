import { forwardRef } from 'react';
import { classNames } from '../../../utils';
import { BaseInput, BaseInputProps } from './BaseInput';

export interface InputProps extends BaseInputProps {
  value?: string | number;
  onChange?: (value: string) => void;
  error?: false | string;
  noFill?: boolean;
  disabled?: boolean;
  type?: 'base' | 'underline';
  inputType?: React.HTMLInputTypeAttribute;
  inputClassName?: string;
  placeholder?: string;
  name?: string;
  containerProps?: React.HTMLAttributes<HTMLDivElement>;
}

export const Input = forwardRef<HTMLDivElement, InputProps>(
  (
    {
      value,
      onChange,
      error = false,
      noFill = false,
      disabled,
      type = 'base',
      inputType,
      className: classNameProp,
      inputClassName,
      placeholder,
      name,
      containerProps,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={classNames(
          'text-paragraph-p2',
          classNameProp,
          type === 'underline' && 'border-b border-currentColor pb-1',
          error && 'text-red'
        )}
        {...containerProps}
      >
        <BaseInput
          {...props}
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
