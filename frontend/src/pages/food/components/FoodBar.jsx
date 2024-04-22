import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { COLORS } from '../../../styles';
import { Avatar } from '../../../components';
import { classNames } from '../../../utils';

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
          { name: 'Carbs.', y: carbs, color: COLORS.blue },
          { name: 'Prot.', y: pro, color: COLORS.green },
          { name: 'Fat', y: fats, color: COLORS.orange },
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
  amount,
  carbs,
  pro,
  fats,
  kcal,
  showChart = true,
  imageUrl,
  onClick,
  className,
  suffix,
}) => {
  return (
    <div
      onClick={onClick}
      className={classNames(
        'flex w-full cursor-pointer items-center gap-2 whitespace-nowrap rounded-md bg-primary-100/75 p-2 text-paragraph-p3 hover:bg-primary-100',
        className
      )}
    >
      <Avatar size={28} url={imageUrl} name={name} />
      <div className="flex flex-[2] justify-between gap-2">
        <div className="flex-1 text-primary-400">{name}</div>
        <div className="flex-1 text-primary-400">{unit}</div>
      </div>
      <div className="flex flex-[3] justify-between gap-2">
        <div className="flex-1 text-blue">{carbs} g</div>
        <div className="flex-1 text-green">{pro} g</div>
        <div className="flex-1 text-orange">{fats} g</div>
        <div className="flex-1 text-primary-600">{kcal} kcal</div>
      </div>
      {amount && (
        <div className="flex flex-[1] text-primary-400">
          <span className="mr-1">x</span>
          {amount}
        </div>
      )}
      {showChart && <SummaryChart carbs={carbs} pro={pro} fats={fats} />}
      {suffix}
    </div>
  );
};
