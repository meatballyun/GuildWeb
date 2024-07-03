import { COLORS } from '../styles';

interface ColumnBarProps {
  total: number;
  height?: number;
  baseColor?: string;
  items: { value: number; color: string }[];
}

export const ColumnBar = ({
  total,
  height = 16,
  baseColor = COLORS['primary-200'],
  items,
}: ColumnBarProps) => {
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
