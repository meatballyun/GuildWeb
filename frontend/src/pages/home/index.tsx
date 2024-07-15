import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api';
import { Button, Loading, MaterialSymbol } from '../../components';
import { formateIsoDate, getNutritionSum } from '../../utils';
import { useSideBar } from '../_layout/MainLayout/SideBar';
import { Block, PaperLayout } from '../_layout/components';
import { CalorieBar } from '../food/RecordPage/CalorieBar';
import { CALORIES } from '../food/RecordPage/RecordPage';
import { NutritionalSummaryChart } from '../food/components';
import { MissionBar } from '../guild/MissionPage/MissionBar';
import './styles.css';
import { DailyRecord, FoodNutation } from '../../api/food/interface';
import { Mission } from '../../api/guild/interface';
import { Query } from '../guild/MissionPage/interface';

const RecordBlock = () => {
  const [dailyFood, setDailyFood] = useState<DailyRecord>();

  const fetchData = async () => {
    const data = await api.food.getDietRecords({
      params: { date: formateIsoDate(new Date()) },
    });
    setDailyFood(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const foodNutritionSum: Partial<FoodNutation> = useMemo(() => {
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
            carbs={foodNutritionSum.carbs ?? 0}
            pro={foodNutritionSum.pro ?? 0}
            fats={foodNutritionSum.fats ?? 0}
          >
            <div className="text-3xl">total</div>
            <div className="p-2 text-5xl">{foodNutritionSum.kcal}</div>
            <div className="text-3xl">kcal</div>
          </NutritionalSummaryChart>
          <div className="flex w-full flex-col gap-4">
            {CALORIES.map(({ key, ...data }) => (
              <CalorieBar
                key={key}
                value={foodNutritionSum[key] ?? 0}
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
  const [missionList, setMissionList] = useState<Mission[]>([]);
  const [query, setQuery] = useState<Query>({ filter: 'all' });

  const fetchMissions = useCallback(async () => {
    const data = await api.guild.getAllMissions();
    if (!Array.isArray(data)) return;

    setMissionList(data);
    return data;
  }, []);

  const handleHeaderBtnClick = (filter: Query['filter']) => {
    setQuery({ filter });
  };

  const filteredMission = useMemo(() => {
    if (!missionList?.length) return [];

    switch (query.filter) {
      case 'inProgress':
        return missionList.filter(({ status }) => status === 'in progress');
      case 'established':
        return missionList.filter(({ status }) => status === 'established');
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
            onClick={() => handleHeaderBtnClick('inProgress')}
            type={query.filter === 'inProgress' ? 'solid' : 'hollow'}
          >
            In Progress
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
            return (
              <div className="mt-4 flex h-full w-full flex-col items-start gap-2">
                {filteredMission.map(({ id, gid, ...data }) => (
                  <Link
                    className="w-full"
                    key={id}
                    to={`guilds/${gid}/missions?focus-mission-id=${id}`}
                  >
                    <MissionBar {...data} />
                  </Link>
                ))}
              </div>
            );
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
