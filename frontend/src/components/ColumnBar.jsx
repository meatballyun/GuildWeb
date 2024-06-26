import { COLORS } from '../styles';

export const ColumnBar = ({
  total,
  height = 16,
  baseColor = COLORS['primary-200'],
  items = [{ value: 0, color: '' }],
}) => {
  return (
    <div
      className="w-full border-currentColor border-solid border overflow-hidden rounded-full relative bg-currentColor flex"
      style={{ height, color: baseColor }}
    >
      {items.map(({ value, color }, i) => (
        <div
          key={i}
          className="h-full"
          style={{ width: `${(value / total) * 100}%`, background: color }}
        />
      ))}
    </div>
  );
};
