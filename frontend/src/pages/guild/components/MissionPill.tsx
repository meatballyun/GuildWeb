import { MissionType } from '../../../api/guild/interface';
import { Pill } from '../../../components';
import { COLORS } from '../../../styles';

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
