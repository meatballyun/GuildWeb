import { classNames } from '../utils';
import { Image } from './Image';

export const Avatar = ({ className, size, url, name = '' }) => {
  return (
    <div
      title={name}
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
      {url ? (
        <Image className="absolute h-full w-full" url={url} />
      ) : (
        <span className="text-[0.5em] text-white">
          {name?.[0]?.toUpperCase()}
        </span>
      )}
    </div>
  );
};

export const AvatarGroup = ({ userList, extraFix, size }) => {
  return (
    <div className="flex -space-x-2">
      {userList.map(({ name, id, ...user }) => (
        <div className="relative" key={id}>
          {extraFix?.({ name, ...user })}
          <Avatar size={size} name={name} {...user} />
        </div>
      ))}
    </div>
  );
};
