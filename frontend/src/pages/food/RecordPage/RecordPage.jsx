import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import './styles.css';
import { api } from '../../../api';
import { CalorieBar } from './CalorieBar';
import { CATEGORIES, FOOD_COLOR } from '../constants';
import { FoodBar, NutritionalSummaryChart } from '../components';
import { Paper } from '../../_layout/components';
import { DietRecordModal } from '../modal';
import { Button, DatePicker, MaterialSymbol } from '../../../components';
import { formateIsoDate, getNutritionSum } from '../../../utils';
import { useSideBar } from '../../_layout/MainLayout/SideBar';

export const CALORIES = [
  { key: 'carbs', text: 'Carbs.', color: FOOD_COLOR.carbs },
  { key: 'pro', text: 'Prot.', color: FOOD_COLOR.pro },
  { key: 'fats', text: 'Fat', color: FOOD_COLOR.fats },
  { key: 'kcal', text: 'Total', color: FOOD_COLOR.kcal },
];

const Category = ({ category }) => {
  const { label, color } = CATEGORIES.find(
    ({ value }) => value === category
  ) ?? { label: 'uncategorized', color: '#555' };
  return (
    <div
      className="sticky top-0 rounded-sm px-2 py-1 text-heading-h5 text-white"
      style={{ backgroundColor: color }}
    >
      {label}
    </div>
  );
};

export const RecordPage = () => {
  useSideBar({ activeKey: ['foods', 'records'] });
  const [date, setDate] = useState(new Date());
  const [isFetched, setIsFetched] = useState(false);
  const [dailyFood, setDailyFood] = useState();
  const [showModal, setShowModal] = useState(false);
  const [modalValue, setModalValue] = useState();

  const fetchData = useCallback(async () => {
    const res = await api.food.getDietRecords({
      params: { date: formateIsoDate(date) },
    });
    const { data } = await res.json();
    setDailyFood(data);
  }, [date]);

  const foodNutritionSum = useMemo(() => {
    if (!dailyFood) return;
    return getNutritionSum(
      dailyFood.foods.map(({ recipe, amount }) => ({ ...recipe, amount }))
    );
  }, [dailyFood]);

  const foolGroupByCategory = useMemo(
    () =>
      dailyFood?.foods.reduce((pre, { category, ...others }) => {
        return { ...pre, [category]: [...(pre[category] ?? []), others] };
      }, {}),
    [dailyFood]
  );

  useEffect(() => {
    (async () => {
      setIsFetched(false);
      await fetchData();
      setIsFetched(true);
    })();
  }, [fetchData]);

  if (!isFetched) return <Paper row>loading</Paper>;

  return (
    <>
      <Paper className="flex flex-col" row>
        <div className="flex w-full items-center justify-center">
          <NutritionalSummaryChart
            size={240}
            carbs={foodNutritionSum.carbs}
            pro={foodNutritionSum.pro}
            fats={foodNutritionSum.fats}
          >
            <div className="text-3xl">total</div>
            <div className="p-2 text-5xl">{foodNutritionSum.kcal}</div>
            <div className="text-3xl">kcal</div>
          </NutritionalSummaryChart>
          <div className="max-w-[640px] flex-1 space-y-4">
            {CALORIES.map(({ key, ...data }) => (
              <CalorieBar
                value={foodNutritionSum[key]}
                target={dailyFood.target[key]}
                {...data}
              />
            ))}
          </div>
        </div>
        <div className="mt-8 flex justify-between">
          <DatePicker value={date} onChange={setDate} />
          <Button
            size="sm"
            className="!rounded-full"
            onClick={() => {
              setShowModal(true);
              setModalValue({ date });
            }}
          >
            + Add DietRecord
          </Button>
        </div>
        <div className="mt-4 flex w-full flex-grow flex-col gap-2 overflow-auto">
          {CATEGORIES.map(({ value: category }) => {
            const foodList = foolGroupByCategory?.[category];
            if (!foodList?.length) return null;
            return (
              <div className="flex flex-col items-start gap-2" key={category}>
                <Category category={category} />
                {foodList.map(({ recipe, amount, id }) => (
                  <Link to={`/foods/recipes/${recipe.id}`} className="w-full">
                    <FoodBar
                      key={id}
                      {...recipe}
                      amount={amount}
                      suffix={
                        <div
                          onClick={async (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            await api.food.deleteDietRecords({
                              pathParams: { id },
                            });
                            fetchData();
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
          })}
        </div>
      </Paper>
      <DietRecordModal
        isOpen={!!showModal}
        value={modalValue}
        onClose={() => setShowModal(false)}
        onFinish={async (formData) => {
          await api.food.postDietRecords({
            body: {
              ...formData,
              date: formateIsoDate(formData.date ?? new Date()),
            },
          });
          await fetchData();
        }}
      />
    </>
  );
};
