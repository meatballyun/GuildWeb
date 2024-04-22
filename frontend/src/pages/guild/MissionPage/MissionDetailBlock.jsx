import {
  Avatar,
  AvatarGroup,
  Button,
  CheckBox,
  MaterialSymbol,
} from '../../../components';
import { Block } from '../../_layout/components';
import { COLORS } from '../../../styles';
import { useMemo } from 'react';
import { MissionPill, MissionStatusWithColor } from '../components';
import { formateDate } from '../../../utils';

const CheckItem = ({ content, showCheckBox, disabled, value, onChange }) => {
  return (
    <div className="inline-block" onClick={() => onChange?.(!value)}>
      {showCheckBox ? <CheckBox value={value} disabled={disabled} /> : '-'}
      <span className="ml-1">{content}</span>
    </div>
  );
};

const Label = ({ children }) => {
  return (
    <div className="inline-block bg-primary-200 pl-2 pr-3 text-heading-h5">
      {children}
    </div>
  );
};

const Item = ({ label, children }) => {
  return (
    <div>
      <Label>{label}</Label>
      <div className="p-2 text-paragraph-p3 text-primary-600">{children}</div>
    </div>
  );
};

export const EmptyMissionDetail = ({ className }) => {
  return (
    <Block className={className} title="Mission Detail">
      <div className="flex h-full w-full items-center justify-center text-paragraph-p1 text-primary-300">
        select a mission
      </div>
    </Block>
  );
};

export const MissionDetailBlock = ({ className, detail, onBtnClick }) => {
  const {
    type,
    repetitiveTasksType,
    name,
    initiationTime,
    deadline,
    status,
    description,
    adventurers,
    items,
    accepted,
    isAccepted,
    creator,
  } = detail;
  const maxAccept = accepted === 'Max Accepted';

  const button = useMemo(() => {
    if (['Cancelled'].includes(status)) return [];
    if (['Completed'].includes(status))
      return [
        {
          disabled: true,
          style: { background: COLORS['primary-200'] },
          prefix: (
            <MaterialSymbol icon="sentiment_very_satisfied" className="mr-1" />
          ),
          children: 'Mission Completed',
        },
      ];
    if (isAccepted) {
      return [
        {
          style: { background: COLORS.red },
          onClick: () => onBtnClick('exit'),
          prefix: <MaterialSymbol icon="close" className="mr-1" />,
          children: 'Exit',
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
          prefix: <MaterialSymbol icon="error" className="mr-1" />,
          children: 'Mission Meet Max Accept',
        },
      ];
    if (status === 'Expired') return [];
    return [
      {
        onClick: () => onBtnClick('accept'),
        prefix: <MaterialSymbol icon="point_scan" className="mr-1" />,
        children: 'Accept',
      },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, accepted, maxAccept]);

  return (
    <Block className={className} title={name}>
      <div className="flex h-full w-full flex-col">
        <div className="flex h-full w-full flex-col items-start gap-2 overflow-auto">
          <Item label="Creator">
            <div className="flex items-center">
              <Avatar size={24} url={creator.imageUrl} name={creator.name} />
              <span className="ml-1">{creator.name}</span>
            </div>
          </Item>
          <Item label="type">
            <MissionPill
              type={type}
              repetitiveTasksType={repetitiveTasksType}
            />
          </Item>
          <Item label="Time">
            {formateDate(initiationTime)} ~ {formateDate(deadline)}
          </Item>
          <Item label="Status">
            <div className="flex items-center gap-2">
              <MissionStatusWithColor
                className="border-r-2 border-primary-200 pr-2"
                status={status}
              />
              <span>participant:</span>
              {(() => {
                if (!adventurers?.length) return 'None';
                return (
                  <AvatarGroup
                    userList={adventurers.map(({ imageUrl, name }) => ({
                      url: imageUrl,
                      name,
                    }))}
                    size={24}
                  />
                );
              })()}
            </div>
          </Item>
          <Item label="Description">{description}</Item>
          {items && (
            <Item label="Chick List">
              <div className="flex flex-col gap-2">
                {items.map((item) => (
                  <CheckItem disabled showCheck {...item} value={true} />
                ))}
              </div>
            </Item>
          )}
        </div>
        <div className="flex gap-2">
          {button.map((props, i) => (
            <Button className="w-full justify-center" key={i} {...props} />
          ))}
        </div>
      </div>
    </Block>
  );
};
