import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { formContext } from './formContext';
import { validateFlow } from './utils';

export const useForm = () => {
  const { formData, handleInputChange } = useContext(formContext);

  return { formData, handleInputChange };
};

export const useFormInstance = ({
  defaultValue,
  validateObject,
  validateMode = 'onSubmit',
  onSubmit,
  onInputChange,
} = {}) => {
  const [formData, setFormData] = useState(defaultValue ?? {});
  const [validation, setValidations] = useState();
  const [isFormDataValid, setIsFormDataValid] = useState(true);
  const isFieldTouched = useRef({});
  const isFormSubmit = useRef(false);

  const submit = () => {
    isFormSubmit.current = true;
    const isValid = validate(true);
    if (!isValid) return;
    onSubmit?.(formData, { isFormDataValid: isValid });
  };

  const handleInputChange = (key, value) => {
    isFieldTouched.current[key] = true;
    setFormData((prevState) => ({
      ...prevState,
      [key]: value,
    }));
    onInputChange?.({ key, value }, formData);
  };

  const validate = useCallback(
    (shouldValidate) => {
      if (typeof validateObject !== 'object') return true;
      const validatedResult = Object.fromEntries(
        Object.entries(validateObject).map(([key, ruleList = []]) => [
          key,
          (shouldValidate === true || shouldValidate[key]) &&
            validateFlow(...ruleList)(
              { fieldName: key, value: formData[key] },
              formData
            ),
        ])
      );
      const isValid = !Object.values(validatedResult).some((v) => v);

      setValidations(validatedResult);
      setIsFormDataValid(isValid);
      return isValid;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [formData]
  );

  useEffect(() => {
    setFormData(defaultValue ?? {});
  }, [defaultValue]);

  useEffect(() => {
    if (validateMode === 'onChange') validate(isFieldTouched.current);
    if (validateMode === 'onSubmit' && isFormSubmit.current)
      validate(isFieldTouched.current);
  }, [validate, validateMode]);

  return {
    isFormDataValid,
    validation,
    validate,
    setValidations,
    formData,
    validateMode,
    setFormData,
    handleInputChange,
    submit,
  };
};
