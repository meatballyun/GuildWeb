import { useState } from 'react';
import { Avatar, Dropdown, MaterialSymbol, Pill } from '../../components';
import { COLORS } from '../../styles';
import { classNames } from '../../utils';

export const MissionStatusWithColor = ({ status, className }) => {
  const colorClassName = (() => {
    switch (status) {
      case 'Established':
        return 'text-blue';
      case 'Pending Activation':
        return 'text-primary-300';
      case 'In Progress':
        return 'text-primary-400';
      case 'Completed':
        return 'text-green';
      case 'Expired':
        return 'text-orange';
      case 'Cancelled':
        return 'text-red';
      default:
    }
  })();
  return <div className={classNames(className, colorClassName)}>{status}</div>;
};

export const MissionPill = ({ type, onClick, suffix }) => {
  const { background, text } = (() => {
    switch (type) {
      case 'Daily':
        return { background: COLORS.green, text: type };
      case 'Weekly':
        return { background: COLORS.blue, text: type };
      case 'Monthly':
        return { background: COLORS.orange, text: type };
      case 'Ordinary':
        return { background: COLORS['primary-200'], text: type };
      case 'Emergency':
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

export const MembershipPill = ({ membership, suffix, onClick }) => {
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

const MemberShipSelect = ({ value: valueProp, onChange }) => {
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
          onItemClick={onChange}
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

export const UserItem = ({
  name,
  imageUrl,
  rank,
  membership,
  onClick,
  focus,
  editAble,
  onItemClick,
}) => {
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
      {editAble ? (
        <MemberShipSelect value={membership} onChange={onItemClick} />
      ) : (
        <MembershipPill membership={membership} />
      )}
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
