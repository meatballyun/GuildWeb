import { classNames } from '../../../utils';
import '../styles.css';

export interface BaseInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  inputClassName?: string;
  onChange?: (value: string) => void;
}

export const BaseInput = ({
  onChange,
  className,
  inputClassName,
  value,
  ...props
}: BaseInputProps) => {
  return (
    <input
      {...props}
      className={classNames('input_container', className)}
      value={value ?? ''}
      onChange={(e) => onChange?.(e.target.value)}
    />
  );
};
