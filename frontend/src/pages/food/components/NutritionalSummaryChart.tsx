import Highcharts from 'highcharts';
import HighchartsReact, {
  HighchartsReactRefObject,
} from 'highcharts-react-official';
import { COLORS } from '../../../styles';
import { classNames } from '../../../utils';
import { useRef } from 'react';
import { FoodNutation } from '../interface';

interface NutritionalSummaryChartProps extends Omit<FoodNutation, 'kcal'> {
  size: number;
  className?: string;
  children: React.ReactNode;
}

export const NutritionalSummaryChart = ({
  carbs,
  pro,
  fats,
  size,
  className,
  children,
}: NutritionalSummaryChartProps) => {
  const ref = useRef<HighchartsReactRefObject>(null);
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
        type: 'pie',
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
