import { api } from '../../../api';
import {
  Mission,
  MissionStatus,
  MissionTemplate,
} from '../../../api/guild/interface';
import { ButtonProps, MaterialSymbol } from '../../../components';
import { COLORS } from '../../../styles';
import { endOfDate, startOfDate } from '../../../utils';
import { ModalType } from './MissionPage';
import { MissionButtonType, MissionPageMode } from './interface';

interface GetBasicMissionBtnPropsParam extends Mission {
  maxAccept: boolean;
  onBtnClick: (type: MissionButtonType) => void;
  userId?: number;
}

const getBasicMissionBtnProps = ({
  status,
  isAccepted,
  adventurers,
  maxAccept,
  creator,
  onBtnClick,
  userId,
}: GetBasicMissionBtnPropsParam) => {
  if (!status || ['cancelled', 'expired'].includes(status)) return [];
  if (['completed'].includes(status))
    return [
      {
        disabled: true,
        style: { background: COLORS['primary-200'] },
        prefix: <MaterialSymbol icon="sentiment_very_satisfied" />,
        children: 'Mission Completed',
      },
    ];
  const adventurersCompleted = adventurers?.some(
    ({ status }) => status === 'completed'
  );
  const isOwned = creator.id === userId;
  const myStatus = adventurers?.find(({ id }) => id === userId)?.status;

  if (adventurersCompleted && isOwned) {
    return [
      {
        onClick: () => onBtnClick(MissionButtonType.COMPLETE),
        prefix: <MaterialSymbol icon="check" />,
        children: 'Complete',
      },
    ];
  }
  if (myStatus === 'completed') {
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
        onClick: () => onBtnClick(MissionButtonType.ABANDON),
        prefix: <MaterialSymbol icon="close" />,
        children: 'Abandon',
      },
      {
        onClick: () => onBtnClick(MissionButtonType.SUBMIT),
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
  if (status === 'expired') return [];
  return [
    {
      onClick: () => onBtnClick(MissionButtonType.ACCEPT),
      prefix: <MaterialSymbol icon="point_scan" />,
      children: 'Accept',
    },
  ];
};

const getManageMissionBtnProps = ({
  status,
  onBtnClick,
}: {
  status?: MissionStatus;
  onBtnClick: (type: MissionButtonType) => void;
}): ButtonProps[] => {
  if (status === 'cancelled')
    return [
      {
        type: 'hollow',
        style: { borderColor: COLORS.red, color: COLORS.red },
        onClick: () => onBtnClick(MissionButtonType.DELETE),
        prefix: <MaterialSymbol icon="delete" />,
        children: 'Delete',
      },
      {
        onClick: () => onBtnClick(MissionButtonType.RESTORE),
        prefix: <MaterialSymbol icon="restore" />,
        children: 'Restore',
      },
    ];
  return [
    {
      type: 'hollow',
      style: { borderColor: COLORS.red, color: COLORS.red },
      onClick: () => onBtnClick(MissionButtonType.CANCEL),
      prefix: <MaterialSymbol icon="cancel" />,
      children: 'Cancel',
    },
    {
      onClick: () => onBtnClick(MissionButtonType.EDIT),
      prefix: <MaterialSymbol icon="edit" />,
      children: 'Edit',
    },
  ];
};

const getTemplateMissionBtnProps = ({
  enabled,
  onBtnClick,
}: {
  enabled: boolean;
  onBtnClick: (type: MissionButtonType) => void;
}): ButtonProps[] => {
  if (enabled)
    return [
      {
        type: 'hollow',
        style: { borderColor: COLORS.red, color: COLORS.red },
        onClick: () => onBtnClick(MissionButtonType.DISABLE),
        prefix: <MaterialSymbol icon="cancel" />,
        children: 'Disable',
      },
      {
        onClick: () => onBtnClick(MissionButtonType.EDIT),
        prefix: <MaterialSymbol icon="edit" />,
        children: 'Edit',
      },
    ];
  return [
    {
      type: 'hollow',
      style: { borderColor: COLORS.red, color: COLORS.red },
      onClick: () => onBtnClick(MissionButtonType.DELETE),
      prefix: <MaterialSymbol icon="delete" />,
      children: 'Delete',
    },
    {
      onClick: () => onBtnClick(MissionButtonType.ENABLE),
      prefix: <MaterialSymbol icon="restore" />,
      children: 'Enable',
    },
  ];
};

interface GetMissionDetailBtnParam {
  detail: Mission | MissionTemplate;
  mode?: MissionPageMode;
  userId?: number;
  onBtnClick: (type: MissionButtonType) => void;
}

export const getMissionDetailBtn = ({
  detail,
  mode,
  userId,
  onBtnClick,
}: GetMissionDetailBtnParam): ButtonProps[] => {
  const maxAccept = 'accepted' in detail && detail.accepted === 'max accepted';

  if ('enabled' in detail)
    return getTemplateMissionBtnProps({
      enabled: !!detail.enabled,
      onBtnClick,
    });
  if (mode) return getManageMissionBtnProps({ ...detail, onBtnClick });
  return getBasicMissionBtnProps({
    ...(detail as Mission),
    userId,
    maxAccept,
    onBtnClick,
  });
};

interface MissionApiParam {
  type?: ModalType;
  gid?: string;
  selectedId?: number | null;
  value: Mission | MissionTemplate;
}

const missionApi = async ({
  type,
  gid,
  selectedId,
  value,
}: MissionApiParam) => {
  if ('generationTime' in value) {
    const startDate = startOfDate(value.generationTime).toISOString();
    const endDate = endOfDate(value.deadline).toISOString();

    const { deadline, ...otherValue } = value;
    const requestBody = {
      ...otherValue,
      generationTime: startDate,
      deadline: endDate,
    };
    if (type === ModalType.EDIT) {
      return api.guild.putTemplate({
        pathParams: { gid, ttid: selectedId },
        data: requestBody,
      });
    }
    return api.guild.postTemplate({
      pathParams: { gid },
      data: requestBody,
    });
  }

  const startDate = startOfDate(value.initiationTime).toISOString();
  const endDate = endOfDate(value.deadline).toISOString();

  const requestBody = {
    ...value,
    missionId: selectedId,
    initiationTime: startDate,
    deadline: endDate,
  };
  if (type === ModalType.EDIT) {
    return api.guild.putGuildsMissions({
      pathParams: { gid, mid: selectedId },
      data: requestBody,
    });
  }
  return api.guild.postGuildsMissions({
    pathParams: { gid },
    data: requestBody,
  });
};

export const handleEditMissionsFinish = async (param: MissionApiParam) => {
  const data = await missionApi(param);
  return data.id;
};
