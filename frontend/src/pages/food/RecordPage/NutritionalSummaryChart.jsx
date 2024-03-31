import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { COLORS } from '../../../styles';

export const NutritionalSummaryChart = ({ total, carbs, pro, fats }) => {
  const options = {
    chart: {
      type: 'pie',
      width: 240,
      height: 240,
      backgroundColor: 'transparent',
    },
    title: null,
    credits: { enabled: false },
    plotOptions: {
      pie: {
        innerSize: '85%',
        depth: 0,
        dataLabels: { enabled: false },
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
    <div className="flex flex-col items-center justify-center text-primary-600 w-[220px] h-[220px]">
      <div className=" relative z-10">
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
      <div className="flex flex-col absolute items-center justify-center ">
        <div className="text-3xl">total</div>
        <div className="text-5xl p-2">{total}</div>
        <div className="text-3xl">kcal</div>
      </div>
    </div>
  );
};
