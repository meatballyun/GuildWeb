import {
  Avatar,
  AvatarGroup,
  Button,
  ButtonProps,
  CheckBox,
  MaterialSymbol,
} from '../../../components';
import { Block } from '../../_layout/components';
import { MissionPill, MissionStatusWithColor } from '../components';
import { formateDate } from '../../../utils';
import { Mission, MissionTemplate } from '../../../api/guild/interface';
import { MissionPageMode } from './interface';

interface CheckItemProps {
  content: React.ReactNode;
  showCheckBox?: boolean;
  disabled?: boolean;
  value?: boolean;
  onChange?: (value: boolean) => void;
}

const CheckItem = ({
  content,
  showCheckBox,
  disabled,
  value,
  onChange,
}: CheckItemProps) => {
  return (
    <div
      className="inline-block"
      onClick={() => !disabled && onChange?.(!value)}
    >
      {showCheckBox ? <CheckBox value={!!value} disabled={disabled} /> : '-'}
      <span className="ml-1">{content}</span>
    </div>
  );
};

export const EmptyMissionDetail = ({ className }: { className: string }) => {
  return (
    <Block className={className} title="Mission Detail">
      <div className="flex h-full w-full items-center justify-center text-paragraph-p1 text-primary-300">
        select a mission
      </div>
    </Block>
  );
};

interface MissionDetailBlockProps {
  className?: string;
  detail: Mission | MissionTemplate;
  onCheckItemClick: (id: number) => void;
  headerBtn: React.ReactNode;
  footerBtn: ButtonProps[];
  mode?: MissionPageMode;
}

export const MissionDetailBlock = ({
  className,
  detail,
  onCheckItemClick,
  headerBtn,
  footerBtn,
  mode,
}: MissionDetailBlockProps) => {
  const {
    type,
    name,
    initiationTime,
    generationTime,
    deadline,
    status,
    description,
    adventurers,
    items,
    isAccepted,
    creator,
    maxAdventurer,
    enabled,
  } = detail as Mission & MissionTemplate;

  return (
    <Block
      className={className}
      title={
        <div className="flex items-center justify-center gap-1">
          <div className="flex-1">{name}</div>
          {headerBtn}
        </div>
      }
    >
      <div className="flex h-full w-full flex-col">
        <div className="flex h-full w-full flex-col items-start gap-2 overflow-auto pb-2">
          <Block.Item label="Creator">
            {creator && (
              <div className="flex items-center">
                <Avatar size={24} url={creator.imageUrl} name={creator.name} />
                <span className="ml-1">{creator.name}</span>
              </div>
            )}
          </Block.Item>
          {mode === MissionPageMode.TEMPLATE && (
            <Block.Item label="Status">
              {enabled ? (
                <span className="text-green text-paragraph-p3 rounded-full">
                  Working
                </span>
              ) : (
                <span className="text-red text-paragraph-p3 rounded-full">
                  Closed
                </span>
              )}
            </Block.Item>
          )}
          <Block.Item label="Type">
            <MissionPill type={type} />
          </Block.Item>
          {mode === MissionPageMode.TEMPLATE ? (
            <Block.Item label="Time">
              {formateDate(generationTime)} ~ {formateDate(deadline)}
            </Block.Item>
          ) : (
            <Block.Item label="Time">
              {formateDate(initiationTime)} ~ {formateDate(deadline)}
            </Block.Item>
          )}
          {mode === MissionPageMode.TEMPLATE && (
            <Block.Item label="Max Adventurer">{maxAdventurer}</Block.Item>
          )}
          {mode !== MissionPageMode.TEMPLATE && (
            <Block.Item label="Status">
              <div className="flex items-center gap-2">
                <MissionStatusWithColor
                  className="border-r-2 border-primary-200 pr-2"
                  status={status}
                />
                <span>
                  adventurers ({adventurers?.length ?? 0}/{maxAdventurer}):
                </span>
                {(() => {
                  if (!adventurers?.length) return 'None';
                  return (
                    <AvatarGroup
                      extraFix={({ status }) => {
                        if (status === 'Completed')
                          return (
                            <div className="absolute -left-[2px] -top-[2px] z-10 flex h-[10px] w-[10px] items-center justify-center rounded-full border border-primary-100 bg-green text-primary-100">
                              <MaterialSymbol
                                icon="done"
                                size={8}
                                weight={700}
                              />
                            </div>
                          );
                        if (status === 'Failed')
                          return (
                            <div className="absolute -left-[2px] -top-[2px] z-10 flex h-[10px] w-[10px] items-center justify-center rounded-full border border-primary-100 bg-red text-primary-100">
                              <MaterialSymbol
                                icon="close"
                                size={8}
                                weight={700}
                              />
                            </div>
                          );
                      }}
                      userList={adventurers.map(
                        ({ imageUrl, name, status }) => ({
                          url: imageUrl,
                          name,
                          status,
                        })
                      )}
                      size={24}
                    />
                  );
                })()}
              </div>
            </Block.Item>
          )}
          <Block.Item
            label="Description"
            className="mt-2 min-h-40 w-full rounded-lg bg-primary-100"
          >
            <div className="whitespace-pre-wrap">{description}</div>
          </Block.Item>
          {!!items?.length && (
            <Block.Item
              label="Check List"
              className="mt-2 flex min-h-40 w-full flex-col gap-2 rounded-lg bg-primary-100"
            >
              {items.map(({ id, content, status }) => (
                <CheckItem
                  key={id}
                  content={content}
                  disabled={!isAccepted}
                  showCheckBox={isAccepted && !mode}
                  value={status === 1}
                  onChange={() => onCheckItemClick(id)}
                />
              ))}
            </Block.Item>
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
