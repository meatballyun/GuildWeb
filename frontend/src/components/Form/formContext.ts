import { createContext } from 'react';
import { FromType } from './interface';

export const formContext = createContext<FromType>({
  disabled: false,
  isFormDataValid: false,
  validation: undefined,
  validate: () => false,
  setValidations: () => {},
  formData: {},
  validateMode: 'onSubmit',
  setFormData: () => {},
  handleInputChange: () => {},
  submit: () => {},
});
