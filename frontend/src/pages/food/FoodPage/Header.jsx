import { MaterialSymbol } from '../../../components';
import './styles.css';

export const Header = ({ date, onDateChange }) => {
  const handleDateChange = (value) => {
    onDateChange(new Date(date.valueOf() + value));
  };

  return (
    <div className="flex justify-between">
      <div className="flex bg-primary-100 border-2 border-solid border-primary-100 overflow-hidden items-center rounded-full">
        <MaterialSymbol
          onClick={() => handleDateChange(-86400000)}
          className="rounded-sm hover:bg-primary-200/50 cursor-pointer transition-all text-primary-500"
          icon="keyboard_arrow_left"
          size={24}
        />
        <div
          className="text-paragraph-p2 px-2 rounded-sm hover:bg-primary-200/50 cursor-pointer text-primary-500"
          transition-all
        >
          {date.toLocaleDateString()}
        </div>
        <MaterialSymbol
          onClick={() => handleDateChange(86400000)}
          className="rounded-sm hover:bg-primary-200/50 cursor-pointer transition-all text-primary-500"
          icon="keyboard_arrow_right"
          size={24}
        />
      </div>
      <div className="flex gap-2">
        <div className="flex border-2 border-solid border-primary-100 overflow-hidden items-center rounded-full text-paragraph-p2 px-2 text-primary-100">
          + Add Recipe
        </div>
        <div className="flex bg-primary-100 border-2 border-solid border-primary-100 overflow-hidden items-center rounded-full text-paragraph-p2 px-2 text-primary-500">
          + Add Food
        </div>
      </div>
    </div>
  );
};
