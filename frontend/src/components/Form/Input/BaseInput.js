import { classNames } from '../../../utils';
import './styles.css';

export const BaseInput = ({ onChange, className, ...props }) => {
  return (
    <div className={classNames('input_container', className)}>
      <input {...props} onChange={(e) => onChange?.(e.target.value)} />
    </div>
  );
};
