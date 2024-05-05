import { api } from '../../../api';
import { MaterialSymbol } from '../../../components';
import { COLORS } from '../../../styles';
import { formateIsoDate } from '../../../utils';

const getBasicMissionBtnProps = ({
  status,
  accepted,
  isAccepted,
  adventurers,
  maxAccept,
  creator,
  onBtnClick,
  userId,
}) => {
  if (['Cancelled', 'Expired'].includes(status)) return [];
  if (['Completed'].includes(status))
    return [
      {
        disabled: true,
        style: { background: COLORS['primary-200'] },
        prefix: <MaterialSymbol icon="sentiment_very_satisfied" />,
        children: 'Mission Completed',
      },
    ];
  const adventurersCompleted = adventurers.some(
    ({ status }) => status === 'Completed'
  );
  const isOwned = creator.id === userId;
  const myStatus = adventurers.find(({ id }) => id === userId)?.status;

  if (adventurersCompleted && isOwned) {
    return [
      {
        onClick: () => onBtnClick('complete'),
        prefix: <MaterialSymbol icon="check" />,
        children: 'Complete',
      },
    ];
  }
  if (myStatus === 'Complete') {
    return [
      {
        disabled: true,
        style: { background: COLORS['primary-200'] },
        children: 'Waiting for mission creator Check',
      },
    ];
  }
  if (isAccepted) {
    return [
      {
        style: { background: COLORS.red },
        onClick: () => onBtnClick('abandon'),
        prefix: <MaterialSymbol icon="close" />,
        children: 'Abandon',
      },
      {
        onClick: () => onBtnClick('submit'),
        prefix: <MaterialSymbol icon="check" />,
        children: 'Submit',
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
  if (status === 'Cancelled')
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

const getTemplateMissionBtnProps = ({ enabled, onBtnClick }) => {
  if (enabled)
    return [
      {
        type: 'hollow',
        style: { borderColor: COLORS.red, color: COLORS.red },
        onClick: () => onBtnClick('disable'),
        prefix: <MaterialSymbol icon="cancel" />,
        children: 'Disable',
      },
      {
        onClick: () => onBtnClick('edit'),
        prefix: <MaterialSymbol icon="edit" />,
        children: 'Edit',
      },
    ];
  return [
    {
      type: 'hollow',
      style: { borderColor: COLORS.red, color: COLORS.red },
      onClick: () => onBtnClick('delete'),
      prefix: <MaterialSymbol icon="delete" />,
      children: 'Delete',
    },
    {
      onClick: () => onBtnClick('enable'),
      prefix: <MaterialSymbol icon="restore" />,
      children: 'Enable',
    },
  ];
};

export const getMissionDetailBtn = ({ detail, mode, userId, onBtnClick }) => {
  const maxAccept = detail.accepted === 'Max Accepted';

  if (mode === 'template')
    return getTemplateMissionBtnProps({
      ...detail,
      maxAccept,
      onBtnClick,
    });
  if (mode)
    return getManageMissionBtnProps({ ...detail, maxAccept, onBtnClick });
  return getBasicMissionBtnProps({
    ...detail,
    userId,
    maxAccept,
    onBtnClick,
  });
};

export const handleEditTasksFinish = async ({
  type,
  mode,
  gid,
  selectedId,
  value,
}) => {
  if (mode === 'template') {
    const { initiationTime, deadline, ...otherValue } = value;
    const data = await api.guild.postTemplate({
      pathParams: { gid },
      body: {
        ...otherValue,
        generationTime: initiationTime ? new Date(initiationTime) : new Date(),
        deadline: deadline ? new Date(deadline) : new Date(),
      },
    });
    const json = await data.json();
    return json.data.id;
  }
  if (type === 'edit') {
    const data = await api.guild.putGuildsTasks({
      pathParams: { gid, tid: selectedId },
      body: {
        ...value,
        taskId: selectedId,
        initiationTime: formateIsoDate(value.initiationTime ?? new Date()),
        deadline: formateIsoDate(value.deadline ?? new Date()),
      },
    });
    const json = await data.json();
    return json.data.id;
  }
  const data = await api.guild.postGuildsTasks({
    pathParams: { gid },
    body: {
      ...value,
      initiationTime: formateIsoDate(value.initiationTime ?? new Date()),
      deadline: formateIsoDate(value.deadline ?? new Date()),
    },
  });
  const json = await data.json();
  return json.data.id;
};
