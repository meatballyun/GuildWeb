import { BaseInput } from '../../../components';
import { classNames } from '../../../utils';

export const IngredientValue = ({
  color,
  title,
  value = 0,
  multiple,
  total,
  onChange,
}) => {
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
      <div className="ml-2 mt-2 flex w-full justify-between border-b-2 px-2 text-paragraph-p1">
        {onChange ? (
          <BaseInput
            className="bg-primary-100"
            value={value}
            onChange={onChange}
          />
        ) : (
          value
        )}
        <span className={className.text}>g</span>
      </div>
      <div className={classNames('w-full text-center text-sm', className.text)}>
        {value * multiple} kcal /{' '}
        {((value * multiple * 100) / total).toFixed(2)} %
      </div>
    </div>
  );
};
