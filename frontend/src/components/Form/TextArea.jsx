export const TextArea = ({ onChange, ...props }) => {
  return <textarea {...props} onChange={(e) => onChange(e.target.value)} />;
};
