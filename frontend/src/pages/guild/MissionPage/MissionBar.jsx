import { classNames } from '../../../utils';
import { MissionPill } from '../components';

export const MissionBar = ({
  name,
  type,
  repetitiveTasksType,
  focus,
  onClick,
}) => {
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
      <MissionPill type={type} repetitiveTasksType={repetitiveTasksType} />
      <div className="w-full flex-1  truncate text-paragraph-p3 text-primary-400">
        {name}
      </div>
    </div>
  );
};
