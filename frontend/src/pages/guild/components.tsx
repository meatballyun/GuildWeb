import { useState } from 'react';
import { Avatar, Dropdown, MaterialSymbol, Pill } from '../../components';
import { COLORS } from '../../styles';
import { classNames } from '../../utils';
import {
  GuildsMember,
  Membership,
  MissionStatus,
  MissionType,
} from '../../api/guild/interface';

interface MissionStatusWithColorProps {
  status?: MissionStatus;
  className: string;
}

export const MissionStatusWithColor = ({
  status,
  className,
}: MissionStatusWithColorProps) => {
  const colorClassName = (() => {
    switch (status) {
      case 'established':
        return 'text-blue';
      case 'in progress':
        return 'text-primary-400';
      case 'completed':
        return 'text-green';
      case 'expired':
        return 'text-orange';
      case 'cancelled':
        return 'text-red';
      default:
    }
  })();
  return <div className={classNames(className, colorClassName)}>{status}</div>;
};

interface MissionPillProps {
  type: MissionType;
  onClick?: () => void;
  suffix?: React.ReactNode;
}

export const MissionPill = ({ type, onClick, suffix }: MissionPillProps) => {
  const { background, text }: { background?: string; text?: string } = (() => {
    switch (type) {
      case 'daily':
        return { background: COLORS.green, text: type };
      case 'weekly':
        return { background: COLORS.blue, text: type };
      case 'monthly':
        return { background: COLORS.orange, text: type };
      case 'ordinary':
        return { background: COLORS['primary-200'], text: type };
      case 'emergency':
        return { background: COLORS.red, text: type };
      default:
        return {};
    }
  })();

  if (!background) return null;
  return (
    <Pill onClick={onClick} style={{ background }}>
      {text}
      {suffix}
    </Pill>
  );
};

interface MembershipPillProps {
  membership: Membership | 'Pending' | 'Delete';
  suffix?: React.ReactNode;
  onClick?: () => void;
}

export const MembershipPill = ({
  membership,
  suffix,
  onClick,
}: MembershipPillProps) => {
  const background = (() => {
    switch (membership) {
      case 'Master':
        return 'linear-gradient(340deg, rgba(255,210,94,1) 0%, rgba(255,241,205,1) 100%)';
      case 'Vice':
        return 'linear-gradient(340deg, rgba(168,168,168,1) 0%, rgba(238,238,238,1) 100%)';
      case 'Regular':
        return COLORS['primary-200'];
      case 'Pending':
        return COLORS['primary-300'];
      case 'Delete':
        return COLORS.red;
      default:
        return null;
    }
  })();

  const fixedMembership = membership === 'Vice' ? 'Vice Master' : membership;

  if (!background) return null;
  return (
    <Pill onClick={onClick} style={{ background }}>
      {fixedMembership}
      {suffix}
    </Pill>
  );
};

interface MemberShipSelectProps {
  value: Membership;
  onChange?: (value: Membership) => void;
}

const MemberShipSelect = ({
  value: valueProp,
  onChange,
}: MemberShipSelectProps) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <MembershipPill
        onClick={() => setOpen((v) => !v)}
        membership={valueProp}
        suffix={<MaterialSymbol icon="arrow_drop_down" size={20} />}
      />
      {open && (
        <Dropdown
          onItemClick={(value) => onChange?.(value as Membership)}
          menuItem={
            valueProp === 'Pending'
              ? [{ label: 'Delete', value: 'Delete' }]
              : [
                  { label: 'Vice Master', value: 'Vice' },
                  { label: 'Regular', value: 'Regular' },
                  {
                    label: <span className="text-red">Delete</span>,
                    value: 'Delete',
                  },
                ].filter(({ value }) => value !== valueProp)
          }
        />
      )}
    </div>
  );
};

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
