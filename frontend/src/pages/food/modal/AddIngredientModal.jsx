import { useEffect, useState } from 'react';
import { BaseInput, MaterialSymbol } from '../../../components';
import { Modal } from '../../../components/Modal';
import { api } from '../../../api';
import { FoodBar } from '../components';

export const AddIngredientModal = ({ onClose, ...props }) => {
  const [foodList, setFoodList] = useState();
  const [search, setSearch] = useState('');
  const [isFetched, setIsFetched] = useState(false);

  useEffect(() => {
    (async () => {
      setIsFetched(false);
      const res = await api.food.getIngredient({ params: { q: search } });
      const { data } = await res.json();
      setIsFetched(true);
      setFoodList(data);
    })();
  }, [search]);

  return (
    <Modal {...props} onClose={onClose} header="Add Ingredient">
      <div className="flex h-full w-full flex-col overflow-hidden">
        <div className="flex w-full rounded-md border border-primary-500 py-1 pl-3 pr-2 text-paragraph-p2 text-primary-500">
          <BaseInput
            value={search}
            onChange={setSearch}
            className="w-full"
            placeholder={`Search with Ingredient name...`}
          />
          <MaterialSymbol icon="search" size={24} />
        </div>

        {(() => {
          if (!isFetched) return <>Loading...</>;
          if (!foodList?.length) return <>No Data</>;
          return (
            <div className="mt-2 flex w-full flex-1 flex-grow flex-col gap-2 overflow-auto  bg-primary-200 p-2">
              {foodList.map((foodItem, i) => (
                <FoodBar
                  {...foodItem}
                  key={i}
                  onClick={() => onClose(foodItem)}
                />
              ))}
            </div>
          );
        })()}
      </div>
    </Modal>
  );
};
