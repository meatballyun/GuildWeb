import { classNames } from '../../../utils';
import { MaterialSymbol } from '../../MaterialSymbol';
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
  const className = classNames(
    'input_container',
    classNameProp,
    error && 'text-red'
  );

  return (
    <div {...props} className={className}>
      <div>{label}</div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {typeof error === 'string' && (
        <div className="absolute top-full text-sm flex items-center">
          <MaterialSymbol icon="warning" size={14} className="mr-1" fill />
          {error}
        </div>
      )}
    </div>
  );
};
