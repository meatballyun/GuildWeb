import { ColumnBar } from '../../../components';
import { classNames } from '../../../utils';

interface CalorieBarProps {
  text: string;
  color: string;
  value: number;
  target: number;
}

export const CalorieBar = ({ text, color, value, target }: CalorieBarProps) => {
  const warning = value > target;
  return (
    <div className="flex-grow px-8" style={{ color }}>
      <div className="flex justify-between">
        <div className="text-2xl text-currentColor">{text}</div>
        <div className="flex items-end justify-between">
          <div className="text-2xl text-currentColor">{value}&nbsp;</div>
          <div
            className={classNames(
              'text-sm',
              warning ? 'text-red' : 'text-primary-300'
            )}
          >
            / {target} ({((value * 100) / target).toFixed(1)}%)
          </div>
        </div>
      </div>
      <ColumnBar height={8} total={target} items={[{ value, color }]} />
    </div>
  );
};
