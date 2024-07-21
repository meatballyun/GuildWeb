import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { formContext } from './formContext';
import { validateFlow } from './utils';
import type {
  FormOnInputChange,
  FormOnSubmit,
  FromType,
  ValidateObj,
} from './interface';

export const useForm = () => {
  const { formData, handleInputChange } = useContext(formContext);

  return { formData, handleInputChange };
};

interface UseFormInstanceParam<FormData extends Record<string, any>> {
  defaultValue?: FormData;
  validateObject?: Record<string, ValidateObj[]>;
  validateMode?: 'onSubmit' | 'onChange';
  onSubmit?: FormOnSubmit<FormData>;
  onInputChange?: FormOnInputChange<FormData>;
}

export const useFormInstance = <FormData extends Record<string, any>>({
  defaultValue,
  validateObject,
  validateMode = 'onSubmit',
  onSubmit,
  onInputChange,
}: UseFormInstanceParam<FormData> = {}): FromType<FormData> => {
  const [formData, setFormData] = useState<FormData>(
    defaultValue ?? ({} as FormData)
  );
  const [validation, setValidations] = useState<
    Record<keyof FormData, string | undefined> | undefined
  >();
  const [isFormDataValid, setIsFormDataValid] = useState(true);
  const isFieldTouched = useRef<Record<string, boolean>>({});
  const isFormSubmit = useRef(false);

  const submit = () => {
    isFormSubmit.current = true;
    const isValid = validate(true);
    if (!isValid) return;
    onSubmit?.(formData, { isFormDataValid: isValid });
  };

  const handleInputChange = (key: string, value: unknown) => {
    isFieldTouched.current[key] = true;
    setFormData((prevState) => ({
      ...prevState,
      [key]: value,
    }));
    onInputChange?.({ key, value }, formData);
  };

  const validate = useCallback(
    (shouldValidate: boolean | Record<string, boolean>) => {
      if (typeof validateObject !== 'object') return true;

      const validatedResult = Object.fromEntries(
        Object.entries(validateObject).map(([key, ruleList = []]) => [
          key,
          (shouldValidate === true ||
            (shouldValidate !== false && shouldValidate[key])) &&
            validateFlow(...(ruleList as ValidateObj[]))(
              { fieldName: key, value: formData[key] },
              formData
            ),
        ])
      ) as Record<keyof FormData, string | undefined>;

      const isValid = !Object.values(validatedResult).some((v) => v);

      setValidations(validatedResult);
      setIsFormDataValid(isValid);
      return isValid;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [formData]
  );

  useEffect(() => {
    setFormData(defaultValue ?? ({} as FormData));
  }, [defaultValue]);

  useEffect(() => {
    if (validateMode === 'onChange') validate(isFieldTouched.current);
    if (validateMode === 'onSubmit' && isFormSubmit.current)
      validate(isFormSubmit.current || isFieldTouched.current);
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
