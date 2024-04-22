import { classNames } from '../utils';
import { Image } from './Image';

export const Avatar = ({ className, size, url, name = '' }) => {
  return (
    <div
      className={classNames(
        'relative flex flex-shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-primary-300 bg-primary-200',
        className
      )}
      style={{
        width: size,
        height: size,
        fontSize: size,
      }}
    >
      <Image className="absolute h-full w-full" url={url} />
      <span className="text-[0.5em] text-white">
        {name?.[0]?.toUpperCase()}
      </span>
    </div>
  );
};

export const AvatarGroup = ({ userList, size }) => {
  return (
    <div className="flex -space-x-2">
      {userList.map(({ name, ...user }, i) => (
        <Avatar size={size} key={i} name={name} {...user} />
      ))}
    </div>
  );
};
