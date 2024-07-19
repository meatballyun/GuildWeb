import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { COLORS } from '../../../styles';
import { Avatar, MaterialSymbol } from '../../../components';
import { classNames } from '../../../utils';
import React from 'react';
import { FoodNutation } from '../interface';

const SummaryChart = ({ carbs, pro, fats }: Omit<FoodNutation, 'kcal'>) => {
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
          { name: 'Carbs.', y: +carbs, color: COLORS.blue },
          { name: 'Prot.', y: +pro, color: COLORS.green },
          { name: 'Fat', y: +fats, color: COLORS.orange },
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

interface FoodBarProps extends FoodNutation {
  name: string;
  isOwned?: boolean;
  published?: boolean;
  unit: string;
  amount?: number | React.ReactNode;
  showChart?: boolean;
  imageUrl?: string | null;
  onClick?: () => void;
  className?: string;
  suffix?: React.ReactNode;
}

export const FoodBar = ({
  name,
  isOwned = true,
  published,
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
}: FoodBarProps) => {
  return (
    <div
      onClick={onClick}
      className={classNames(
        'relative flex w-full cursor-pointer items-center gap-2 whitespace-nowrap rounded-md  p-2 text-paragraph-p3',
        isOwned
          ? 'bg-primary-100/75 hover:bg-primary-100'
          : 'bg-primary-200/75 hover:bg-primary-200',
        className
      )}
    >
      {!!published && (
        <MaterialSymbol
          className="absolute left-1 top-1 z-50 h-3 w-3 rounded-full bg-primary-100 text-primary-300"
          size={12}
          icon="public"
          fill
        />
      )}
      <Avatar size={28} url={imageUrl ?? undefined} name={name} />
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
