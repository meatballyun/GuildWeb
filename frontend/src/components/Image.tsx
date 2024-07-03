import { classNames } from '../utils';

interface ImageProps extends React.HTMLAttributes<HTMLDivElement> {
  url: string;
  backgroundSize?: React.CSSProperties['backgroundSize'];
  backgroundPosition?: React.CSSProperties['backgroundPosition'];
}

export const Image = ({
  url,
  backgroundSize = 'cover',
  backgroundPosition = 'center',
  className,
  ...props
}: ImageProps) => {
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
