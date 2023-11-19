import './styles.css';

export const Input = ({ label, value, onChange, type, ...props }) => {
  return (
    <div className="input_container" {...props}>
      {label}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};
