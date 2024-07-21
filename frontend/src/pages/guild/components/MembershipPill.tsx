import { Membership } from '../../../api/guild/interface';
import { Pill } from '../../../components';
import { COLORS } from '../../../styles';

interface MembershipPillProps {
  membership: Membership | 'pending' | 'delete';
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
      case 'master':
        return 'linear-gradient(340deg, rgba(255,210,94,1) 0%, rgba(255,241,205,1) 100%)';
      case 'vice':
        return 'linear-gradient(340deg, rgba(168,168,168,1) 0%, rgba(238,238,238,1) 100%)';
      case 'regular':
        return COLORS['primary-200'];
      case 'pending':
        return COLORS['primary-300'];
      case 'delete':
        return COLORS.red;
      default:
        return null;
    }
  })();

  const fixedMembership = membership === 'vice' ? 'vice master' : membership;

  if (!background) return null;
  return (
    <Pill onClick={onClick} style={{ background }}>
      {fixedMembership}
      {suffix}
    </Pill>
  );
};
