import { classNames } from '../../../utils';
import { MaterialSymbol } from '../../MaterialSymbol';
import { BaseInput } from './BaseInput';
import './styles.css';

export const Input = ({
  label,
  value,
  onChange,
  type,
  error,
  className: classNameProp,
  ...props
}) => {
  return (
    <div
      {...props}
      className={classNames(
        'border-b border-b-currentColor text-paragraph-p2',
        classNameProp,
        error && 'text-red'
      )}
    >
      <div className="-ml-2 mb-2 text-heading-h5">{label}</div>
      <BaseInput type={type} value={value} onChange={onChange} />
      {typeof error === 'string' && (
        <div className="absolute top-full flex items-center text-sm">
          <MaterialSymbol icon="warning" size={14} className="mr-1" fill />
          {error}
        </div>
      )}
    </div>
  );
};
