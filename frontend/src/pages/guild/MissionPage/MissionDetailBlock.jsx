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
import { classNames, formateDate } from '../../../utils';
import { api } from '../../../api';

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
    <div className="inline-block pl-2 text-heading-h5 text-primary-300">
      <span className="underline">{children}</span>：
    </div>
  );
};

const Item = ({ label, className, children }) => {
  return (
    <div className="flex w-full flex-wrap items-center">
      <Label>{label}</Label>
      <div
        className={classNames(
          'p-2 text-paragraph-p3 text-primary-600',
          className
        )}
      >
        {children}
      </div>
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

export const MissionDetailBlock = ({
  className,
  detail,
  onBtnClick,
  onCheckItemClick,
}) => {
  const {
    type,
    repetitiveTaskType,
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
        <div className="flex h-full w-full flex-col items-start gap-2 overflow-auto pb-2">
          <Item label="Creator">
            <div className="flex items-center">
              <Avatar size={24} url={creator.imageUrl} name={creator.name} />
              <span className="ml-1">{creator.name}</span>
            </div>
          </Item>
          <Item label="Type">
            <MissionPill type={type} repetitiveTaskType={repetitiveTaskType} />
          </Item>
          <Item label="Time">
            {formateDate(initiationTime).replaceAll('-', '/')} ~{' '}
            {formateDate(deadline).replaceAll('-', '/')}
          </Item>
          <Item label="Status">
            <div className="flex items-center gap-2">
              <MissionStatusWithColor
                className="border-r-2 border-primary-200 pr-2"
                status={status}
              />
              <span>adventurers:</span>
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
          <Item
            label="Description"
            className="mt-2 min-h-40 w-full rounded-lg bg-primary-100"
          >
            <div className="whitespace-pre-wrap">{description}</div>
          </Item>
          {!!items?.length && (
            <Item
              label="Chick List"
              className="mt-2 flex min-h-40 w-full flex-col gap-2 rounded-lg bg-primary-100"
            >
              {items.map(({ id, content, status }) => (
                <CheckItem
                  key={id}
                  content={content}
                  disabled={!isAccepted}
                  showCheckBox={isAccepted}
                  value={status === 1}
                  onChange={() => onCheckItemClick(id)}
                />
              ))}
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
