import { classNames } from '../../../utils';
import { MissionPill } from '../components';
import { MISSION_STATUS_LIST } from './contants';

const MissionStatusIcon = ({ status }) => {
  const currentStatus = MISSION_STATUS_LIST.find(({ text }) => text === status);
  const textColor =
    status === 'Established' ? 'text-red' : currentStatus.textColor;
  return (
    <div
      className={classNames('border-current rotate-3 border px-1', textColor)}
    >
      {status === 'Established' ? 'Accepted' : status}
    </div>
  );
};

export const MissionBar = ({
  name,
  type,
  status,
  repetitiveTaskType,
  focus,
  isAccepted,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={classNames(
        'flex w-full cursor-pointer items-center gap-2 whitespace-nowrap rounded-md p-2 transition-all',
        focus && 'border-2 border-primary-400 bg-primary-100',
        !isAccepted && 'bg-primary-200/50 hover:bg-primary-200/30',
        !focus && isAccepted && 'bg-primary-100/50 hover:bg-primary-100'
      )}
    >
      <MissionPill type={type} repetitiveTaskType={repetitiveTaskType} />
      <div className="w-full flex-1  truncate text-paragraph-p3 text-primary-400">
        {name}
      </div>
      {isAccepted && <MissionStatusIcon status={status} />}
    </div>
  );
};
