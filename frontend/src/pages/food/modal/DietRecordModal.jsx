import { useEffect, useState } from 'react';
import {
  Button,
  DatePicker,
  DropdownSelect,
  Form,
  Input,
  MaterialSymbol,
  useFormInstance,
  validate,
} from '../../../components';
import { Modal } from '../../../components/Modal';
import { api } from '../../../api';
import { FoodBar } from '../components';
import { CATEGORIES } from '../constants';

export const DietRecordModal = ({
  isOpen,
  onClose,
  value,
  onFinish,
  ...props
}) => {
  const [recipeList, setRecipeList] = useState([]);
  const [search, setSearch] = useState('');
  const [isFetched, setIsFetched] = useState(false);

  const handleSubmit = async (formData) => {
    await onFinish?.(formData);
    onClose?.();
  };
  const form = useFormInstance({
    validateObject: {
      category: [validate.required],
      recipe: [validate.required],
      amount: [validate.required],
    },
    onSubmit: handleSubmit,
  });

  useEffect(() => {
    (async () => {
      setIsFetched(false);
      const res = await api.food.getRecipes({ params: { q: search } });
      const { data } = await res.json();
      setIsFetched(true);
      setRecipeList(data);
    })();
  }, [search]);

  useEffect(() => {
    form.setFormData(value ?? {});
  }, [value, isOpen]);

  return (
    <Modal
      {...props}
      isOpen={isOpen}
      onClose={onClose}
      header="Add Diet Record"
      footButton={[{ onClick: form.submit, text: 'Submit' }]}
    >
      <Form form={form}>
        <div className="flex h-[500px] w-full flex-col gap-2 overflow-hidden p-2">
          <Form.Item valueKey="date" label="Date">
            <DatePicker />
          </Form.Item>
          <Form.Item valueKey="category" label="Category">
            <DropdownSelect
              placeholder="select category"
              renderValue={(_, { custom }) => custom?.label}
              options={CATEGORIES.map(({ value, label, color }) => ({
                value,
                label: <span style={{ color }}>{label}</span>,
                custom: { label },
              }))}
            />
          </Form.Item>
          <div className="flex items-end gap-4">
            <Form.Item valueKey="recipe" className="w-1/2" label="Recipe">
              <DropdownSelect
                placeholder="select recipe"
                renderValue={(_, { custom }) => custom?.recipe?.name}
                options={recipeList.map((recipe) => ({
                  value: recipe.id,
                  label: <FoodBar {...recipe} className="!bg-white/0 p-0" />,
                  custom: { recipe },
                }))}
              />
            </Form.Item>
            <MaterialSymbol
              icon="close"
              size={20}
              className="text-primary-500"
            />
            <Form.Item valueKey="amount" label="Amount" className="w-1/2">
              <Input
                type="underline"
                className="border-b px-2 py-1 text-paragraph-p3"
              />
            </Form.Item>
          </div>
        </div>
      </Form>
    </Modal>
  );
};
