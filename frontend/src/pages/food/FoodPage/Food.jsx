export const Food = ({ name, unit, count, carbs, pro, fats, kcal }) => {
  return (
    <div className="flex items-center bg-primary-100 gap-2 w-full p-2 rounded-md text-paragraph-p3 whitespace-nowrap">
      <div className="w-7 h-7 bg-primary-200 rounded-full flex-shrink-0"></div>
      <div className="flex flex-[10] justify-between">
        <div className="flex-[3] text-primary-400">{name}</div>
        <div className="flex-[1] text-primary-400">{unit}</div>
        <div className="flex-[1] text-primary-400">x {count}</div>
      </div>
      <div className="flex-[1]"></div>
      <div className="flex flex-[6] justify-between">
        <div className="flex-1 text-blue">{carbs}</div>
        <div className="flex-1 text-green">{pro}</div>
        <div className="flex-1 text-orange">{fats}</div>
        <div className="flex-1 text-primary-600">{kcal}</div>
      </div>
    </div>
  );
};
