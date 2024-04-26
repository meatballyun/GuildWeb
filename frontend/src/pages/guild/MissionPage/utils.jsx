import { MaterialSymbol } from '../../../components';
import { COLORS } from '../../../styles';

const getBasicMissionBtnProps = ({
  status,
  isAccepted,
  maxAccept,
  onBtnClick,
}) => {
  if (['Cancelled'].includes(status)) return [];
  if (['Completed'].includes(status))
    return [
      {
        disabled: true,
        style: { background: COLORS['primary-200'] },
        prefix: <MaterialSymbol icon="sentiment_very_satisfied" />,
        children: 'Mission Completed',
      },
    ];
  if (isAccepted) {
    return [
      {
        style: { background: COLORS.red },
        onClick: () => onBtnClick('abandon'),
        prefix: <MaterialSymbol icon="close" />,
        children: 'Abandon',
      },
      {
        onClick: () => onBtnClick('complete'),
        prefix: <MaterialSymbol icon="check" />,
        children: 'Complete',
      },
    ];
  }
  if (
    maxAccept &&
    ['Established', 'Pending Activation', 'In Progress'].includes(status)
  )
    return [
      {
        disabled: true,
        style: { background: COLORS['primary-200'] },
        prefix: <MaterialSymbol icon="error" />,
        children: 'Mission Meet Max Accept',
      },
    ];
  if (status === 'Expired') return [];
  return [
    {
      onClick: () => onBtnClick('accept'),
      prefix: <MaterialSymbol icon="point_scan" />,
      children: 'Accept',
    },
  ];
};

const getManageMissionBtnProps = ({ status, onBtnClick }) => {
  if (status === 'Cancelled') {
    return [
      {
        type: 'hollow',
        style: { borderColor: COLORS.red, color: COLORS.red },
        onClick: () => onBtnClick('delete'),
        prefix: <MaterialSymbol icon="delete" />,
        children: 'Delete',
      },
      {
        onClick: () => onBtnClick('restore'),
        prefix: <MaterialSymbol icon="restore" />,
        children: 'Restore',
      },
    ];
  }
  return [
    {
      type: 'hollow',
      style: { borderColor: COLORS.red, color: COLORS.red },
      onClick: () => onBtnClick('cancel'),
      prefix: <MaterialSymbol icon="cancel" />,
      children: 'Cancel',
    },
    {
      onClick: () => onBtnClick('edit'),
      prefix: <MaterialSymbol icon="edit" />,
      children: 'Edit',
    },
  ];
};

export const getMissionDetailBtn = ({ detail, manageMode, onBtnClick }) => {
  const maxAccept = detail.accepted === 'Max Accepted';
  if (manageMode)
    return getManageMissionBtnProps({ ...detail, maxAccept, onBtnClick });
  return getBasicMissionBtnProps({ ...detail, maxAccept, onBtnClick });
};
