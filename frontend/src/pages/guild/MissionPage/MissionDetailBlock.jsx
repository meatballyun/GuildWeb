import { Avatar, AvatarGroup, Button, CheckBox } from '../../../components';
import { Block } from '../../_layout/components';
import { MissionPill, MissionStatusWithColor } from '../components';
import { classNames, formateDate } from '../../../utils';

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
  onCheckItemClick,
  headerBtn,
  footerBtn,
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
    isAccepted,
    creator,
  } = detail;

  return (
    <Block
      className={className}
      title={
        <div className="flex items-center justify-center gap-1">
          {name}
          {headerBtn}
        </div>
      }
    >
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
          {footerBtn.map((props, i) => (
            <Button className="w-full justify-center" key={i} {...props} />
          ))}
        </div>
      </div>
    </Block>
  );
};
