import { useEffect, useState } from 'react';
import './styles.css';
import { api } from '../../../api';
import { Header } from './Header';
import { NutritionalSummaryChart } from './NutritionalSummaryChart';
import { CalorieBar } from './CalorieBar';
import { FOOD_COLOR } from '../constants';
import { FoodBar } from '../components';

const calories = [
  { key: 'carbs', text: 'Carbs.', color: FOOD_COLOR.carbs },
  { key: 'pro', text: 'Prot.', color: FOOD_COLOR.pro },
  { key: 'fats', text: 'Fat', color: FOOD_COLOR.fats },
  { key: 'kcal', text: 'Total', color: FOOD_COLOR.kcal },
];

export const RecordPage = () => {
  const [date, setDate] = useState(new Date());
  const [dailyFood, setDailyFood] = useState();
  useEffect(() => {
    (async () => {
      const res = await api.food.getDietRecords({
        params: { date: date.toISOString() },
      });
      const data = await res.json();
      setDailyFood(data);
    })();
  }, [date]);

  if (!dailyFood) return <></>;

  return (
    <>
      <Header date={date} onDateChange={setDate} />
      <div className="food-layout-container">
        <div className="flex w-full items-center justify-center">
          <NutritionalSummaryChart
            total={dailyFood.kcal}
            carbs={dailyFood.carbs}
            pro={dailyFood.pro}
            fats={dailyFood.fats}
          />
          <div className="max-w-[640px] flex-1">
            {calories.map(({ key, ...data }) => (
              <CalorieBar
                value={dailyFood[key]}
                target={dailyFood.target[key]}
                {...data}
              />
            ))}
          </div>
        </div>
        <div className="mt-8 flex w-full flex-grow flex-col gap-2">
          {dailyFood.foods.map((food, i) => (
            <FoodBar key={i} {...food} />
          ))}
        </div>
      </div>
    </>
  );
};
