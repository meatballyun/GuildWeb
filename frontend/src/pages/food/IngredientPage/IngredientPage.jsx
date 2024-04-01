import { useEffect, useState } from 'react';
import { api } from '../../../api';
import { FoodBar } from '../components';
import { BaseInput, Button, MaterialSymbol } from '../../../components';
import { Paper } from '../../_layout/components';
import { Link } from 'react-router-dom';

export const IngredientPage = () => {
  const [ingredientList, setIngredientList] = useState();
  const [search, setSearch] = useState('');
  const [isFetched, setIsFetched] = useState(false);

  useEffect(() => {
    (async () => {
      setIsFetched(false);
      const res = await api.food.getIngredient({ params: { q: search } });
      const data = await res.json();
      setIsFetched(true);
      setIngredientList(data);
    })();
  }, [search]);

  return (
    <Paper row className="mt-4 flex flex-col items-center justify-center p-8">
      <div className="my-4 text-heading-h1 text-primary-500">Ingredient</div>
      <div className="mb-4 flex w-full justify-between">
        <div className="flex w-full max-w-72 rounded-full border border-primary-500 py-1 pl-3 pr-2 text-paragraph-p2 text-primary-500">
          <BaseInput
            value={search}
            onChange={setSearch}
            className="w-full"
            placeholder="Search with Ingredient name..."
          />
          <MaterialSymbol icon="search" size={24} />
        </div>
        <Button size="sm" className="!rounded-full">
          + Add New
        </Button>
      </div>
      <div className="h-full w-full overflow-auto">
        {(() => {
          if (!isFetched) return <>Loading...</>;
          if (!ingredientList?.length) return <>No Data</>;
          return (
            <div className="flex w-full flex-grow flex-col gap-2">
              {ingredientList.map((ingredient, i) => (
                <Link key={i} to={`/food/ingredient/${ingredient.id}`}>
                  <FoodBar {...ingredient} />
                </Link>
              ))}
            </div>
          );
        })()}
      </div>
    </Paper>
  );
};
