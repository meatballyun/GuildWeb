import { useEffect, useState } from 'react';
import {
  DatePicker,
  DropdownSelect,
  Form,
  Input,
  MaterialSymbol,
  useFormInstance,
  validate,
} from '../../../components';
import { Modal, ModalProps } from '../../../components/Modal';
import { api } from '../../../api';
import { FoodBar } from '../components';
import { CATEGORIES } from '../constants';
import { Recipe } from '../../../api/food/interface';

export interface DietRecordModalFormData {
  date?: Date;
  category?: string;
  recipe?: number;
  amount?: number;
}

interface DietRecordModalProps extends ModalProps {
  value?: DietRecordModalFormData;
  onFinish: (formData?: DietRecordModalFormData) => Promise<void>;
}

export const DietRecordModal = ({
  isOpen,
  onClose,
  value,
  onFinish,
  ...props
}: DietRecordModalProps) => {
  const [recipeList, setRecipeList] = useState<Recipe[]>([]);
  const [search, setSearch] = useState('');
  const [isFetched, setIsFetched] = useState(false);

  const handleSubmit = async (formData: DietRecordModalFormData) => {
    await onFinish?.(formData);
    onClose?.();
  };
  const form = useFormInstance({
    validateObject: {
      category: [validate.required],
      recipeId: [validate.required],
      amount: [validate.required],
    },
    onSubmit: handleSubmit,
  });

  useEffect(() => {
    (async () => {
      setIsFetched(false);
      await api.food
        .getRecipes({ params: { q: search } })
        .then((data) => {
          setRecipeList(data);
        })
        .catch(() => {});
      setIsFetched(true);
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
      footButton={[{ onClick: form.submit, children: 'Submit' }]}
    >
      <Form form={form}>
        <div className="flex w-full flex-col gap-2 overflow-hidden p-2">
          <Form.Item valueKey="date" label="Date">
            <DatePicker />
          </Form.Item>
          <Form.Item
            valueKey="category"
            label="Category"
            normalize={(v) => v?.[0]}
          >
            <DropdownSelect
              placeholder="select category"
              renderValue={(_, option) => {
                const { custom } = option?.[0] ?? {};
                return custom?.label;
              }}
              options={CATEGORIES.map(({ value, label, color }) => ({
                key: value,
                value,
                label: <span style={{ color }}>{label}</span>,
                custom: { label },
              }))}
            />
          </Form.Item>
          <div className="flex items-end gap-4">
            <Form.Item
              valueKey="recipeId"
              className="w-1/2"
              label="Recipe"
              normalize={(v) => v?.[0]}
            >
              <DropdownSelect
                placeholder="select recipe"
                renderValue={(_, option) => {
                  const { custom } = option?.[0] ?? {};
                  return custom?.recipe?.name;
                }}
                options={recipeList?.map((recipe) => ({
                  key: `${recipe.id}`,
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
