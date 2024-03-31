import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

export const NutritionalSummaryChart = ({ total, carbs, pro, fats }) => {
  const options = {
    chart: {
      type: 'pie',
      width: 240,
      height: 240,
      backgroundColor: 'rgba(0,0,0,0)',
    },
    title: null,
    plotOptions: {
      pie: {
        innerSize: '85%',
        depth: 0,
        dataLabels: { enabled: false },
      },
    },
    credits: { enabled: false },
    series: [
      {
        name: 'kcal',
        data: [
          { name: 'Carbs.', y: carbs, color: '#80A927' },
          { name: 'Prot.', y: pro, color: '#DA8D32' },
          { name: 'Fat', y: fats, color: '#4C76C7' },
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
