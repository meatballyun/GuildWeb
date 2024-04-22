export const CheckBox = ({ value = false, onChange, ...props }) => {
  return (
    <input
      checked={value}
      type="checkbox"
      {...props}
      onChange={(e) => onChange?.(e.target.value)}
    />
  );
};
