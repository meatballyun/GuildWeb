import { cloneElement, useContext } from 'react';
import { formContext } from './formContext';
import { classNames } from '../../utils';
import { MaterialSymbol } from '../MaterialSymbol';

export const FormItem = ({
  valueKey,
  children,
  label,
  className,
  normalize,
  layout = 'col',
  noStyle = false,
}) => {
  const { formData, handleInputChange, disabled, validation } =
    useContext(formContext);
  const error = validation?.[valueKey];

  const handleChange = (value) => {
    handleInputChange(valueKey, normalize ? normalize(value) : value);
  };
  const dom = cloneElement(children, {
    value: formData[valueKey],
    onChange: handleChange,
    disabled: children.props.disabled ?? disabled,
    error: !!error,
  });

  if (noStyle) return dom;
  return (
    <div
      className={classNames(error ? 'text-red' : 'text-primary-500', className)}
    >
      <div className={classNames('flex gap-1', layout === 'col' && 'flex-col')}>
        <div className="mt-1 text-heading-h5">{label}:</div>
        <div className="w-full">
          {dom}
          {typeof error === 'string' && (
            <div className="flex items-center text-sm">
              <MaterialSymbol icon="warning" size={14} className="mr-1" fill />
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
