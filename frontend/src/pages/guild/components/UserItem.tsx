import { GuildsMember, Membership } from '../../../api/guild/interface';
import { Avatar } from '../../../components';
import { classNames } from '../../../utils';
import { MembershipPill } from './MembershipPill';
import { MemberShipSelect } from './MemberShipSelect';

interface UserItemProps extends Omit<GuildsMember, 'membership'> {
  membership?: Membership;
  onClick?: () => void;
  focus?: boolean;
  editAble?: boolean;
  onItemClick?: (value: Membership) => void;
}

export const UserItem = ({
  name,
  imageUrl,
  rank,
  membership,
  onClick,
  focus,
  editAble,
  onItemClick,
}: UserItemProps) => {
  const classNameByRank = (() => {
    if (rank < 10) return 'bg-primary-300';
    if (rank < 50) return 'bg-green';
    return 'bg-blue';
  })();

  return (
    <div
      onClick={onClick}
      className={classNames(
        'flex w-full cursor-pointer items-center gap-2 whitespace-nowrap rounded-md p-2',
        focus
          ? 'border-2 border-primary-400 bg-primary-100'
          : 'bg-primary-100/50 hover:bg-primary-100'
      )}
    >
      <Avatar size={28} url={imageUrl} name={name} />
      <div className="flex-1 truncate text-paragraph-p3 text-primary-400">
        {name}
      </div>
      {membership &&
        (editAble ? (
          <MemberShipSelect value={membership} onChange={onItemClick} />
        ) : (
          <MembershipPill membership={membership} />
        ))}
      <div
        className={classNames(
          'rounded-full px-2 text-center text-white',
          classNameByRank
        )}
      >
        LV. {rank}
      </div>
    </div>
  );
};
