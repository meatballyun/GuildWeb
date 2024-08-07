import { Input } from '../../../components';
import { classNames } from '../../../utils';

interface IngredientValueProps {
  color: string;
  title: React.ReactNode;
  value?: number;
  multiple: number;
  total: number;
  onChange?: (value: string) => void;
  disabled?: boolean;
}

export const IngredientValue = ({
  color,
  title,
  value = 0,
  multiple,
  total,
  onChange,
  disabled,
}: IngredientValueProps) => {
  const className = (() => {
    switch (color) {
      case 'green':
        return { bg: 'bg-green', text: 'text-green' };
      case 'orange':
        return { bg: 'bg-orange', text: 'text-orange' };
      case 'blue':
      default:
        return { bg: 'bg-blue', text: 'text-blue' };
    }
  })();
  return (
    <div className="flex flex-col items-start p-2">
      <div
        className={classNames(
          'rounded-sm px-2 py-1 text-heading-h3 text-primary-100',
          className.bg
        )}
      >
        {title}
      </div>
      <div className="ml-2 mt-2 flex w-full justify-between border-b-2 text-paragraph-p1">
        {onChange ? (
          <Input
            value={value}
            onChange={onChange}
            disabled={disabled}
            inputType="number"
          />
        ) : (
          <span className="px-2">{value}</span>
        )}
        <span className={className.text}>g</span>
      </div>
      <div className={classNames('w-full text-center text-sm', className.text)}>
        {(value * multiple).toFixed(2)} kcal /{' '}
        {((value * multiple * 100) / total).toFixed(2)} %
      </div>
    </div>
  );
};
