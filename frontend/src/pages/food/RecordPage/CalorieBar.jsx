import { ColumnBar } from '../../../components';
import { classNames } from '../../../utils';

export const CalorieBar = ({ text, color, value, target }) => {
  return (
    <div className="flex-grow px-8 mt-4 ">
      <div className="flex justify-between">
        <div className={classNames('text-2xl')} style={{ color: color }}>
          {text}
        </div>
        <div className="flex justify-between items-end">
          <div className={classNames('text-2xl')} style={{ color: color }}>
            {value}&nbsp;
          </div>
          <div className="text-[20px] text-primary-200">
            /&nbsp;{target} ({((value * 100) / target).toFixed(1)}%)
          </div>
        </div>
      </div>
      <ColumnBar
        height={8}
        total={target}
        items={[{ value: value, color: color }]}
      />
    </div>
  );
};
