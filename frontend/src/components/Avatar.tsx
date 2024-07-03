import { classNames } from '../utils';
import { Image } from './Image';

interface AvatarProps {
  className?: string;
  size: number;
  url?: string;
  name?: string;
}

export const Avatar = ({ className, size, url, name = '' }: AvatarProps) => {
  return (
    <div
      title={name}
      className={classNames(
        'relative flex flex-shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-primary-300 bg-primary-200',
        className
      )}
      style={{ width: size, height: size, fontSize: size }}
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

interface AvatarGroupProps {
  size: number;
  userList: (Omit<AvatarProps, 'size'> & { id?: string })[];
  extraFix?: (
    param: Omit<AvatarProps, 'size'> & Record<string, any>
  ) => React.ReactNode;
}

export const AvatarGroup = ({ userList, extraFix, size }: AvatarGroupProps) => {
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
