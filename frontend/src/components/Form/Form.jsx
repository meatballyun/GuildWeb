import { formContext } from './formContext';
import { FormItem } from './FormItem';
import { useFormInstance } from './hooks';

export const Form = ({ defaultValue, form, children, disabled }) => {
  const instanceValue = useFormInstance({ defaultValue });

  return (
    <formContext.Provider value={{ ...(form ?? instanceValue), disabled }}>
      {children}
    </formContext.Provider>
  );
};

Form.Item = FormItem;
