import { classNames } from '../../utils';
import './styles.css';

interface TextAreaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  noFill?: boolean;
  onChange?: (value: string) => void;
}

export const TextArea = ({
  onChange,
  noFill,
  disabled,
  className,
  ...props
}: TextAreaProps) => {
  return (
    <textarea
      className={classNames(
        'input_container textArea_container text-paragraph-p3',
        !disabled && !noFill && 'bg-primary-100',
        className
      )}
      disabled={disabled}
      {...props}
      onChange={(e) => onChange?.(e.target.value)}
    />
  );
};
