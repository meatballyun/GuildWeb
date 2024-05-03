import { classNames } from '../../utils';
import './styles.css';

export const TextArea = ({
  onChange,
  noFill,
  disabled,
  className,
  error,
  ...props
}) => {
  return (
    <textarea
      className={classNames(
        'input_container textArea_container text-paragraph-p3',
        !disabled && !noFill && 'bg-primary-100',
        className
      )}
      disabled={disabled}
      {...props}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};
