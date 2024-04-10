import { MaterialSymbol } from '../../../components';
import './styles.css';

export const Header = ({ date, onDateChange }) => {
  const handleDateChange = (value) => {
    onDateChange(new Date(date.valueOf() + value));
  };

  return (
    <div className="flex justify-between">
      <div className="flex items-center overflow-hidden rounded-full border-2 border-solid border-primary-100 bg-primary-100">
        <MaterialSymbol
          onClick={() => handleDateChange(-86400000)}
          className="cursor-pointer rounded-sm text-primary-500 transition-all hover:bg-primary-200/50"
          icon="keyboard_arrow_left"
          size={24}
        />
        <div
          className="cursor-pointer rounded-sm px-2 text-paragraph-p2 text-primary-500 hover:bg-primary-200/50"
          transition-all
        >
          {date.toLocaleDateString()}
        </div>
        <MaterialSymbol
          onClick={() => handleDateChange(86400000)}
          className="cursor-pointer rounded-sm text-primary-500 transition-all hover:bg-primary-200/50"
          icon="keyboard_arrow_right"
          size={24}
        />
      </div>
      <div className="flex gap-2">
        <div className="flex items-center overflow-hidden rounded-full border-2 border-solid border-primary-100 px-2 text-paragraph-p2 text-primary-100">
          + Add Recipe
        </div>
        <div className="flex items-center overflow-hidden rounded-full border-2 border-solid border-primary-100 bg-primary-100 px-2 text-paragraph-p2 text-primary-500">
          + Add DietRecord
        </div>
      </div>
    </div>
  );
};
