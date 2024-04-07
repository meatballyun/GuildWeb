import { cloneElement, useContext } from 'react';
import { formContext } from './formContext';

export const FormItem = ({ valueKey, children }) => {
  const { formData, handleInputChange } = useContext(formContext);

  const handleChange = (value) => {
    handleInputChange(valueKey, value);
  };

  return cloneElement(children, {
    value: formData[valueKey],
    onChange: handleChange,
  });
};

