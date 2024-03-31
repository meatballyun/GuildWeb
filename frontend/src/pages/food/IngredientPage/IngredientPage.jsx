import { useEffect, useState } from 'react';
import './styles.css';
import { api } from '../../../api';

const Ingredient = ({ name, unit, count, carbs, pro, fats, kcal }) => {
  return (
    <div className="flex items-center bg-primary-100 gap-2 w-full p-2 rounded-md text-paragraph-p3 whitespace-nowrap">
      <div className="w-7 h-7 bg-primary-200 rounded-full flex-shrink-0"></div>
      <div className="flex flex-[10] justify-between">
        <div className="flex-[3] text-primary-400">{name}</div>
        <div className="flex-[1] text-primary-400">{unit}</div>
        <div className="flex-[1] text-primary-400">x {count}</div>
      </div>
      <div className="flex-[1]"></div>
      <div className="flex flex-[6] justify-between">
        <div className="flex-1 text-blue">{carbs}</div>
        <div className="flex-1 text-green">{pro}</div>
        <div className="flex-1 text-orange">{fats}</div>
        <div className="flex-1 text-primary-600">{kcal}</div>
      </div>
    </div>
  );
};

export const IngredientPage = () => {
  const [ingredients, setIngredients] = useState();
  const [date, setDate] = useState(new Date());
  const [dailyFood, setdailyFood] = useState();
  useEffect(() => {
    (async () => {
      const res = await api.food.dietRecords({ date: date.toISOString() });
      const data = await res.json();
      setdailyFood(data);
      console.log(dailyFood);
    })();
  }, [date]);

  if (!dailyFood) return <></>;

  return (
    <>
      <div className="food-layout-container">
        <div className="mt-4 text-primary-500 text-heading-h1">Ingredient</div>
        <div>
          <div className="mt-4 w-72 h-10 pl-2 border border-primary-500 rounded-full input_container">
            <input placeholder="search with Ingredient name..."></input>
          </div>
          <div className="flex bg-primary-100 border-2 border-solid border-primary-100 overflow-hidden items-center rounded-full text-paragraph-p2 px-2 text-primary-500">
            + Add New
          </div>
        </div>

        <div className="h-full w-full">
          <div className="flex flex-grow flex-col w-full mt-8 gap-2">
            {dailyFood.foods.map((food, i) => (
              <Ingredient key={i} {...food} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
