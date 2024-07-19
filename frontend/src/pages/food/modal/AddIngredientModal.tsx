import { useEffect, useState } from 'react';
import { Button, Input, MaterialSymbol } from '../../../components';
import { Modal, ModalProps } from '../../../components/Modal';
import { api } from '../../../api';
import { FoodBar } from '../components';
import { Ingredient } from '../../../api/food/interface';

interface AddIngredientModalProps extends ModalProps {
  onClose: (value?: boolean | Ingredient) => void;
}

export const AddIngredientModal = ({
  onClose,
  ...props
}: AddIngredientModalProps) => {
  const [foodList, setFoodList] = useState<Ingredient[]>();
  const [search, setSearch] = useState('');
  const [isFetched, setIsFetched] = useState(false);
  const [published, setPublished] = useState(false);

  useEffect(() => {
    (async () => {
      setIsFetched(false);
      await api.food
        .getIngredients({
          params: { q: search, published },
        })
        .then((data) => setFoodList(data))
        .catch(() => {});
      setIsFetched(true);
    })();
  }, [search, published]);

  return (
    <Modal
      {...props}
      onClose={onClose}
      header="Add Ingredient"
      contentClassName="flex h-full w-full flex-col overflow-hidden"
    >
      <div className="flex w-full rounded-md border border-primary-500 bg-primary-100 py-1 pl-3 pr-2 text-paragraph-p2 text-primary-500">
        <Input
          value={search}
          onChange={setSearch}
          className="w-full"
          inputClassName="!bg-transparent"
          placeholder="Search with Ingredient name..."
        />
        <MaterialSymbol icon="search" size={24} />
      </div>
      <div className="mt-2 flex">
        <Button
          className="text-nowrap"
          type={published ? 'solid' : 'hollow'}
          onClick={() => setPublished(true)}
        >
          Show All
        </Button>
        <Button
          className="ml-2 text-nowrap"
          type={!published ? 'solid' : 'hollow'}
          onClick={() => setPublished(false)}
        >
          Only Mine
        </Button>
      </div>

      {(() => {
        if (!isFetched) return <>Loading...</>;
        if (!foodList?.length) return <>No Data</>;
        return (
          <div className="mt-2 flex h-0 w-full flex-1 flex-grow flex-col gap-2 overflow-auto  bg-primary-200/10 p-2">
            {foodList.map((foodItem, i) => (
              <FoodBar
                {...foodItem}
                key={i}
                onClick={() => onClose?.(foodItem)}
              />
            ))}
          </div>
        );
      })()}
    </Modal>
  );
};
