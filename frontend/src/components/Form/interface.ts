export interface FromType<FormData extends Record<string, any> = any> {
  isFormDataValid?: boolean;
  disabled?: boolean;
  validation: Record<keyof FormData, string | undefined> | undefined;
  validate?: (shouldValidate: boolean | Record<string, boolean>) => boolean;
  setValidations: React.Dispatch<
    React.SetStateAction<Record<keyof FormData, string | undefined> | undefined>
  >;
  formData: FormData;
  validateMode: 'onSubmit' | 'onChange';
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  handleInputChange: (key: string, value: unknown) => void;
  submit?: () => void;
}

export type ValidateObj = (
  param: { fieldName: string; value: any },
  formData: any
) => void;

export type FormOnSubmit<FormData> = (
  formData: FormData,
  options: { isFormDataValid: boolean }
) => void;

export type FormOnInputChange<FormData> = (
  data: { key: string; value: unknown },
  formData: FormData
) => void;
