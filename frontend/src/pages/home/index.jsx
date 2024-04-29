import { useCallback, useEffect, useMemo, useState } from 'react';
import { api } from '../../api';
import { Button, Loading, MaterialSymbol } from '../../components';
import { useSideBar } from '../_layout/MainLayout/SideBar';
import { Block, PaperLayout } from '../_layout/components';
import { CalorieBar } from '../food/RecordPage/CalorieBar';
import { CALORIES } from '../food/RecordPage/RecordPage';
import './styles.css';
import { formateDate, getNutritionSum } from '../../utils';
import { NutritionalSummaryChart } from '../food/components';
import { Link } from 'react-router-dom';
import { HeaderButton } from '../guild/MissionPage/HeaderButton';
import { MissionBar } from '../guild/MissionPage/MissionBar';

const RecordBlock = () => {
  const [dailyFood, setDailyFood] = useState();

  const fetchData = async () => {
    const res = await api.food.getDietRecords({
      params: { date: formateDate(new Date()) },
    });
    const { data } = await res.json();
    setDailyFood(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const foodNutritionSum = useMemo(() => {
    if (!dailyFood) return {};
    return getNutritionSum(
      dailyFood.foods.map(({ recipe, amount }) => ({ ...recipe, amount }))
    );
  }, [dailyFood]);

  return (
    <div
      className="mr-2 flex h-full w-full flex-col items-center justify-center gap-4"
      title="daily record"
    >
      {!dailyFood ? (
        <div className="text-3xl text-primary-300">
          <Loading />
        </div>
      ) : (
        <>
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
          <div className="flex w-full flex-col gap-4">
            {CALORIES.map(({ key, ...data }) => (
              <CalorieBar
                key={key}
                value={foodNutritionSum[key]}
                target={dailyFood.target[key]}
                {...data}
              />
            ))}
          </div>
          <Link to="/foods/records" className="mt-auto">
            <Button suffix={<MaterialSymbol icon="arrow_forward" />}>
              Go to food Page
            </Button>
          </Link>
        </>
      )}
    </div>
  );
};

const MissionBlock = () => {
  const [isFetched, setIsFetched] = useState(false);
  const [missionList, setMissionList] = useState([]);
  const [query, setQuery] = useState({ filter: 'all' });

  const fetchMissions = useCallback(async () => {
    const res = await api.guild.getAllTasks();
    if (res.status !== 200) return;
    const data = await res.json();
    if (!Array.isArray(data.data)) return;

    setMissionList(data.data);
    return data.data;
  }, []);

  const handleHeaderBtnClick = (filter) => {
    setQuery({ filter });
  };

  const filteredMission = useMemo(() => {
    if (!missionList?.length) return [];

    switch (query.filter) {
      case 'inProcess':
        return missionList.filter(({ status }) => status === 'In Process');
      case 'expired':
        return missionList.filter(({ status }) => status === 'Expired');
      case 'all':
      default:
        return missionList;
    }
  }, [missionList, query]);

  useEffect(() => {
    (async () => {
      setIsFetched(false);
      await fetchMissions();
      setIsFetched(true);
    })();
  }, [fetchMissions]);

  return (
    <Block className="h-full w-full" title="Today Missions">
      <div className="flex w-full flex-col">
        <div className="flex items-center gap-2">
          <div className="border-r-2 border-primary-200 pr-2">
            <Button
              onClick={() => handleHeaderBtnClick('all')}
              type={query.filter === 'all' ? 'solid' : 'hollow'}
            >
              All
            </Button>
          </div>
          <Button
            onClick={() => handleHeaderBtnClick('inProcess')}
            type={query.filter === 'inProcess' ? 'solid' : 'hollow'}
          >
            In Process
          </Button>
          <Button
            onClick={() => handleHeaderBtnClick('established')}
            type={query.filter === 'established' ? 'solid' : 'hollow'}
          >
            Established
          </Button>
        </div>
        <div className="flex h-full w-full flex-col items-center justify-center">
          {(() => {
            if (!isFetched)
              return (
                <div className="text-3xl text-primary-300">
                  <Loading />
                </div>
              );
            if (!filteredMission.length)
              return (
                <div className="text-3xl text-primary-300">No Mission :D</div>
              );
            return filteredMission.map(({ id, ...data }) => (
              <div className="flex flex-col gap-2">
                <MissionBar key={id} {...data} />
              </div>
            ));
          })()}
        </div>
      </div>
    </Block>
  );
};

function HomePage() {
  useSideBar({ activeKey: 'home' });

  return (
    <PaperLayout>
      <PaperLayout.Content>
        <RecordBlock />
        <MissionBlock />
      </PaperLayout.Content>
    </PaperLayout>
  );
}

export default HomePage;
