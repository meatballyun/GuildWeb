import { ColumnBar, MaterialSymbol } from '../../components';

export const FoodPage = () => {
  return (
    <>
      <div className="flex">
        <div className="flex bg-primary-100 border-2 border-solid border-primary-100 overflow-hidden items-center rounded-full">
          <MaterialSymbol
            className="rounded-sm hover:bg-primary-200/50 cursor-pointer transition-all"
            icon="keyboard_arrow_left"
            size={24}
          />
          <div
            className="text-paragraph-p2 px-2 rounded-sm hover:bg-primary-200/50 cursor-pointer"
            transition-all
          >
            2022 / 12 / 12
          </div>
          <MaterialSymbol
            className="rounded-sm hover:bg-primary-200/50 cursor-pointer transition-all"
            icon="keyboard_arrow_right"
            size={24}
          />
        </div>
      </div>
    </>
  );
};
