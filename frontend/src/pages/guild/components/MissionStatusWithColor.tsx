import { MissionStatus } from '../../../api/guild/interface';
import { classNames } from '../../../utils';

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
