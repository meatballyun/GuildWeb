import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { COLORS } from '../../../styles';
import { CircleImage } from '../../../components';

const SummaryChart = ({ carbs, pro, fats }) => {
  const options = {
    chart: {
      type: 'pie',
      width: 42,
      height: 42,
      margin: 0,
      spacing: [0, 0, 0, 0],
      backgroundColor: 'transparent',
    },
    tooltip: { enabled: false },
    title: null,
    credits: { enabled: false },
    plotOptions: {
      pie: {
        borderRadius: 0,
        dataLabels: { enabled: false },
        borderWidth: 0,
      },
    },
    series: [
      {
        name: 'kcal',
        data: [
          { name: 'Carbs.', y: carbs, color: COLORS.green },
          { name: 'Prot.', y: pro, color: COLORS.orange },
          { name: 'Fat', y: fats, color: COLORS.blue },
        ],
      },
    ],
  };
  return (
    <div className="relative flex h-6 w-6 items-center justify-center overflow-hidden rounded-full border border-white">
      <div className="pointer-events-none absolute">
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
    </div>
  );
};

export const FoodBar = ({
  name,
  unit,
  count,
  carbs,
  pro,
  fats,
  kcal,
  showChart = true,
  imageUrl,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="flex w-full cursor-pointer items-center gap-2 whitespace-nowrap rounded-md bg-primary-100/75 p-2 text-paragraph-p3 hover:bg-primary-100"
    >
      <CircleImage size={28} url={imageUrl} />
      <div className="flex flex-[6] justify-between">
        <div className="flex-[2] text-primary-400">{name}</div>
        <div className="flex-[1] text-primary-400">{unit}</div>
        {count && <div className="flex-[1] text-primary-400">x {count}</div>}
      </div>
      <div className="flex flex-[6] justify-between">
        <div className="flex-1 text-blue">{carbs} g</div>
        <div className="flex-1 text-green">{pro} g</div>
        <div className="flex-1 text-orange">{fats} g</div>
        <div className="flex-1 text-primary-600">{kcal} kcal</div>
      </div>
      {showChart && <SummaryChart carbs={carbs} pro={pro} fats={fats} />}
    </div>
  );
};
