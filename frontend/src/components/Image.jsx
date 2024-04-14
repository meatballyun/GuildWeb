import { classNames } from '../utils';

export const Image = ({
  url,
  backgroundSize = 'cover',
  backgroundPosition = 'center',
  className = '',
  ...props
}) => {
  return (
    <div
      {...props}
      className={classNames('h-full w-full', className)}
      style={{
        backgroundImage: url && `url("${url}")`,
        backgroundSize,
        backgroundPosition,
      }}
    />
  );
};
