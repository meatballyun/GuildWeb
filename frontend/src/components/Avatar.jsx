import { classNames } from '../utils';
import { Image } from './Image';

export const Avatar = ({ className, size, url, text = '' }) => {
  return (
    <div
      className={classNames(
        'flex flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary-200',
        className
      )}
      style={{
        width: size,
        height: size,
        fontSize: size,
      }}
    >
      {url ? (
        <Image className="h-full w-full" url={url} />
      ) : (
        <span className="text-[0.5em] text-white">
          {text?.[0].toUpperCase()}
        </span>
      )}
    </div>
  );
};
