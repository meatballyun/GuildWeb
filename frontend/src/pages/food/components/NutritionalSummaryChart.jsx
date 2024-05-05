import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { COLORS } from '../../../styles';
import { classNames } from '../../../utils';
import { useRef } from 'react';

export const NutritionalSummaryChart = ({
  size,
  carbs,
  pro,
  fats,
  className,
  children,
}) => {
  const ref = useRef();
  const options = {
    chart: {
      type: 'pie',
      width: size,
      height: size,
      backgroundColor: 'transparent',
    },
    title: null,
    credits: { enabled: false },
    plotOptions: {
      pie: {
        borderRadius: 0,
        innerSize: '85%',
        depth: 0,
        dataLabels: { enabled: false },
      },
    },
    series: [
      {
        name: 'kcal',
        data: [
          { name: 'Carbs.', y: +carbs, color: COLORS.blue },
          { name: 'Prot.', y: +pro, color: COLORS.green },
          { name: 'Fat', y: +fats, color: COLORS.orange },
        ],
      },
    ],
  };

  ref?.current?.chart?.update?.({
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
  });

  return (
    <div
      className={classNames(
        'relative flex flex-col items-center justify-center text-primary-600',
        className
      )}
      style={{ width: size - 20, height: size - 20 }}
    >
      <div className="relative z-10">
        <HighchartsReact ref={ref} highcharts={Highcharts} options={options} />
      </div>
      <div className="absolute flex flex-col items-center justify-center ">
        {children}
      </div>
    </div>
  );
};
