import { useContext, useEffect, useState } from 'react';
import { formContext } from './formContext';

export const useForm = () => {
  const { formData, handleInputChange } = useContext(formContext);

  return { formData, handleInputChange };
};

export const useFormInstance = ({ defaultValue }) => {
  const [formData, setFormData] = useState(defaultValue ?? {});
  useEffect(() => {
    setFormData(defaultValue ?? {});
  }, [defaultValue]);

  const handleInputChange = (key, value) => {
    setFormData((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  return { formData, handleInputChange };
};
