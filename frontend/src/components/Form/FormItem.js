import { cloneElement, useContext } from 'react';
import { formContext } from './formContext';
import { classNames } from '../../utils';

export const FormItem = ({
  valueKey,
  children,
  label,
  className,
  noStyle = false,
}) => {
  const { formData, handleInputChange } = useContext(formContext);

  const handleChange = (value) => {
    handleInputChange(valueKey, value);
  };
  const dom = cloneElement(children, {
    value: formData[valueKey],
    onChange: handleChange,
  });

  if (noStyle) return dom;
  return (
    <div className={classNames('flex flex-col gap-1', className)}>
      <div className="text-heading-h5 text-primary-500">{label}</div>
      {dom}
    </div>
  );
};
