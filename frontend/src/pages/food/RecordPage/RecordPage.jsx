import { useEffect, useState } from 'react';
import './styles.css';
import { api } from '../../../api';
import { Header } from './Header';
import { NutritionalSummaryChart } from './NutritionalSummaryChart';
import { CalorieBar } from './CalorieBar';
import { Food } from './Food';

export const RecordPage = () => {
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
      <Header date={date} onDateChange={setDate} />
      <div className="food-layout-container">
        <div className="flex w-full justify-center items-center">
          <NutritionalSummaryChart
            total={dailyFood.kcal}
            carbs={dailyFood.carbs}
            pro={dailyFood.pro}
            fats={dailyFood.fats}
          />
          <div className="flex-grow max-w-[640px]">
            <CalorieBar
              text={'Carbs.'}
              color={'#80A927'}
              value={dailyFood.carbs}
              target={dailyFood.target.carbs}
            />
            <CalorieBar
              text={'Prot.'}
              color={'#DA8D32'}
              value={dailyFood.pro}
              target={dailyFood.target.pro}
            />
            <CalorieBar
              text={'Fat'}
              color={'#4C76C7'}
              value={dailyFood.fats}
              target={dailyFood.target.fats}
            />
            <CalorieBar
              text={'Total'}
              color={'#3B2826'}
              value={dailyFood.kcal}
              target={dailyFood.target.kcal}
            />
          </div>
        </div>
        <div className="flex flex-grow flex-col w-full mt-8 gap-2">
          {dailyFood.foods.map((food, i) => (
            <Food key={i} {...food} />
          ))}
        </div>
      </div>
    </>
  );
};
