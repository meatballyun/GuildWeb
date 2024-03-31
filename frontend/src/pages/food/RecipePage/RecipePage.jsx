import { useEffect, useState } from 'react';
import './styles.css';
import { api } from '../../../api';

export const RecipePage = () => {
  const [recipes, setRecipes] = useState();
  useEffect(() => {
    (async () => {
      // const res = await api.food.dietRecords({ date: date.toISOString() });
      // const data = await res.json();
      // setdailyFood(data);
      // console.log(dailyFood);
    })();
  }, []);

  //if (!recipes) return <></>;

  return (
    <>
      <div>RecipePage</div>
    </>
  );
};
