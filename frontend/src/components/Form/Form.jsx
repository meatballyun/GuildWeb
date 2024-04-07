import { formContext } from './formContext';
import { FormItem } from './FormItem';
import { useFormInstance } from './hooks';

export const Form = ({ defaultValue, form, children }) => {
  const instanceValue = useFormInstance({ defaultValue });

  return (
    <formContext.Provider value={form ?? instanceValue}>
      {children}
    </formContext.Provider>
  );
};

Form.Item = FormItem;
