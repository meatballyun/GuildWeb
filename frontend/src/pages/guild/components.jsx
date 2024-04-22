import { useState } from 'react';
import { Avatar, Dropdown, MaterialSymbol } from '../../components';
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

export const MissionPill = ({ type, repetitiveTasksType, onClick }) => {
  const { background, text } = (() => {
    switch (type) {
      case 'Repetitive':
        if (repetitiveTasksType === 'Daily')
          return { background: COLORS.green, text: repetitiveTasksType };
        if (repetitiveTasksType === 'Weekly')
          return { background: COLORS.blue, text: repetitiveTasksType };
        return { background: COLORS.orange, text: repetitiveTasksType };
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
    <div
      onClick={onClick}
      className="flex items-center rounded-full px-2 text-paragraph-p3 text-white shadow-sm"
      style={{ background }}
    >
      {text}
    </div>
  );
};

export const MembershipPill = ({ membership, suffix, onClick }) => {
  const background = (() => {
    switch (membership) {
      case 'Master':
        return 'linear-gradient(340deg, rgba(255,210,94,1) 0%, rgba(255,241,205,1) 100%)';
      case 'Admin':
        return 'linear-gradient(340deg, rgba(168,168,168,1) 0%, rgba(238,238,238,1) 100%)';
      case 'Regular':
        return COLORS['primary-200'];
      case 'Delete':
        return COLORS.red;
      default:
        return null;
    }
  })();

  if (!background) return null;
  return (
    <div
      onClick={onClick}
      className="flex items-center rounded-full px-2 text-paragraph-p3 text-white shadow-sm"
      style={{ background }}
    >
      {membership}
      {suffix}
    </div>
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
          menuItem={[
            { label: 'Admin', value: 'Admin' },
            { label: 'Unset', value: 'Regular' },
            { label: 'Delete', value: 'Delete' },
          ].filter(({ value }) => value !== valueProp)}
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
