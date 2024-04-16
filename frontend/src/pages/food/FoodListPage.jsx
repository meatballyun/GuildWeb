import { useEffect, useState } from 'react';
import { api } from '../../api';
import { FoodBar } from './components';
import { Button, Input, MaterialSymbol } from '../../components';
import { Paper } from '../_layout/components';
import { Link } from 'react-router-dom';
import { useSideBar } from '../_layout/MainLayout/SideBar';

export const FoodListPage = ({ title }) => {
  useSideBar({ activeKey: ['food', title.toLowerCase()] });
  const [foodList, setFoodList] = useState();
  const [search, setSearch] = useState('');
  const [isFetched, setIsFetched] = useState(false);

  const apiUtil =
    title === 'Ingredient' ? api.food.getIngredient : api.food.getRecipe;
  const fetchData = async () => {
    const res = await apiUtil({ params: { q: search } });
    const data = await res.json();
    setFoodList(data.data);
  };

  useEffect(() => {
    (async () => {
      setIsFetched(false);
      await fetchData();
      setIsFetched(true);
    })();
  }, [search, title]);

  const handleDelete = async (id) => {
    const apiUtil =
      title === 'Ingredient'
        ? api.food.deleteIngredient
        : api.food.deleteRecipe;
    const res = await apiUtil({ pathParams: { id } });
    if (res.status === 200) {
      fetchData();
    }
  };

  return (
    <Paper row className="flex flex-col items-center justify-center">
      <div className="mb-4 text-heading-h1 text-primary-500">{title}</div>
      <div className="mb-4 flex w-full justify-between">
        <div className="flex w-full max-w-72 rounded-full border border-primary-500 py-1 pl-3 pr-2 text-paragraph-p2 text-primary-500">
          <Input
            noFill
            value={search}
            onChange={setSearch}
            className="w-full"
            placeholder={`Search with ${title} name...`}
          />
          <MaterialSymbol icon="search" size={24} />
        </div>
        <Link to={`/food/${title.toLowerCase()}/edit/new`}>
          <Button size="sm" className="!rounded-full">
            + Add New
          </Button>
        </Link>
      </div>
      <div className="h-full w-full overflow-auto">
        {(() => {
          if (!isFetched) return <>Loading...</>;
          if (!foodList?.length) return <>No Data</>;
          return (
            <div className="flex w-full flex-grow flex-col gap-2">
              {foodList.map((foodItem, i) => (
                <Link
                  key={i}
                  to={`/food/${title.toLowerCase()}/${foodItem.id}`}
                >
                  <FoodBar
                    {...foodItem}
                    suffix={
                      <div
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleDelete(foodItem.id);
                        }}
                        className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full border border-primary-600 text-primary-600 hover:bg-primary-600/20"
                      >
                        <MaterialSymbol icon="delete" size={20} />
                      </div>
                    }
                  />
                </Link>
              ))}
            </div>
          );
        })()}
      </div>
    </Paper>
  );
};
