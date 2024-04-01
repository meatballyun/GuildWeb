import { useEffect, useState } from 'react';
import { api } from '../../api';
import { FoodBar } from './components';
import { BaseInput, Button, MaterialSymbol } from '../../components';
import { Paper } from '../_layout/components';

export const IngredientDetailPage = () => {
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
    <Paper row className="mt-4 flex items-center justify-center p-8">
      <div className="flex flex-col">
        <div className=""></div>
      </div>
      <div></div>
    </Paper>
  );
};
