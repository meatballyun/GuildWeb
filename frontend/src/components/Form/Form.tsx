import { formContext } from './formContext';
import { FormItem } from './FormItem';
import { useFormInstance } from './hooks';
import { type FromType } from './interface';

interface FormProps<FormData extends Record<string, any> = any> {
  defaultValue?: FormData;
  form?: FromType;
  children: React.ReactNode;
  disabled?: boolean;
}

export const Form = <FormData extends Record<string, any> = any>({
  defaultValue,
  form,
  children,
  disabled,
}: FormProps) => {
  const instanceValue = useFormInstance<FormData>({ defaultValue });

  return (
    <formContext.Provider value={{ ...(form ?? instanceValue), disabled }}>
      {children}
    </formContext.Provider>
  );
};

Form.Item = FormItem;
