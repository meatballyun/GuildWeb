interface CheckBoxProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'value' | 'onChange' | 'type' | 'checked'
  > {
  value: boolean;
  onChange?: (value: boolean) => void;
}

export const CheckBox = ({
  value = false,
  onChange,
  ...props
}: CheckBoxProps) => {
  return (
    <input
      checked={value}
      type="checkbox"
      {...props}
      onChange={(e) => onChange?.(e.target.value as unknown as boolean)}
    />
  );
};
