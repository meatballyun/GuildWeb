import { formateDate } from '../utils';
import { MaterialSymbol } from './MaterialSymbol';

export const ONE_DAY_MILLISECOND = 1000 * 60 * 60 * 24;

export const DatePicker = ({ value: valueProp = new Date(), onChange }) => {
  const handleDateChange = (value) => {
    onChange(new Date(new Date(valueProp).valueOf() + value));
  };

  return (
    <div className="flex w-[148px] items-center overflow-hidden rounded-full border-2 border-solid border-primary-100 bg-primary-100">
      <MaterialSymbol
        onClick={() => handleDateChange(-ONE_DAY_MILLISECOND)}
        className="cursor-pointer rounded-sm text-primary-500 transition-all hover:bg-primary-200/50"
        icon="keyboard_arrow_left"
        size={24}
      />
      <div
        className="w-24 cursor-pointer rounded-sm px-2 text-center text-paragraph-p2 text-primary-500 transition-all hover:bg-primary-200/50"
        onClick={() => onChange(new Date())}
      >
        {formateDate(valueProp)}
      </div>
      <MaterialSymbol
        onClick={() => handleDateChange(ONE_DAY_MILLISECOND)}
        className="cursor-pointer rounded-sm text-primary-500 transition-all hover:bg-primary-200/50"
        icon="keyboard_arrow_right"
        size={24}
      />
    </div>
  );
};
