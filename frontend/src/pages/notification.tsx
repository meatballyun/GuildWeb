import { useEffect, useMemo, useState } from 'react';
import { api } from '../api';
import { useSideBar } from './_layout/MainLayout/SideBar';
import { Block, PaperLayout } from './_layout/components';
import { classNames } from '../utils';
import { Avatar, Button, Pill, Loading, MaterialSymbol } from '../components';
import { COLORS } from '../styles';
import { Notification } from '../api/notification/interface';

interface NotificationBarProps extends Notification {
  focus?: boolean;
  onClick: () => void;
}

const NotificationBar = ({
  title,
  read,
  focus,
  sender,
  onClick,
}: NotificationBarProps) => {
  return (
    <div
      onClick={onClick}
      className={classNames(
        'relative flex w-full cursor-pointer items-start gap-2 whitespace-nowrap rounded-md p-2 transition-all',
        read && 'bg-primary-200/50 hover:bg-primary-200/80',
        !focus && !read && 'bg-primary-100',
        focus && 'border-2 border-primary-400 bg-primary-100'
      )}
    >
      {!read && (
        <div className="absolute -left-1 -top-1 h-[14px] w-[14px] rounded-full border-2 border-primary-100 bg-red" />
      )}
      {sender && <Avatar url={sender.imageUrl} name={sender.name} size={24} />}
      <div className="w-full flex-1 basis-0 overflow-hidden whitespace-pre-wrap">
        <div className="truncate text-heading-h4 text-primary-400">{title}</div>
      </div>
    </div>
  );
};

export const EmptyNotificationDetail = ({
  className,
}: {
  className?: string;
}) => {
  return (
    <Block className={className} title="Notification Detail">
      <div className="flex w-full items-center justify-center text-paragraph-p1 text-primary-300">
        select a notification
      </div>
    </Block>
  );
};

interface NotificationDetailBlockProps {
  className?: string;
  detail: Notification;
  onFootBtnClick: () => void;
  onDelete: () => void;
}

export const NotificationDetailBlock = ({
  className,
  detail,
  onFootBtnClick,
  onDelete,
}: NotificationDetailBlockProps) => {
  const { type, createTime, title, description, sender, used } = detail;
  const footerBtn = useMemo(() => {
    if (used)
      return [
        {
          disabled: true,
          style: { background: COLORS['primary-200'] },
          prefix: <MaterialSymbol icon="done" />,
          children: 'used',
        },
      ];
    const targetId = sender.id;
    if (type === 'guild')
      return [
        {
          onClick: async () => {
            await api.guild.getGuildsInvitation({
              pathParams: { gid: targetId },
            });
            onFootBtnClick();
          },
          prefix: <MaterialSymbol icon="done" />,
          children: 'Confirm',
        },
      ];
    return [
      {
        onClick: async () => {
          await api.user.putUserFriendStatus({
            pathParams: { uid: targetId },
            data: { status: 'confirmed' },
          });
          onFootBtnClick();
        },
        prefix: <MaterialSymbol icon="done" />,
        children: 'Confirm',
      },
    ];
  }, [detail]);

  return (
    <Block
      className={className}
      title={
        <div className="flex items-center justify-center gap-1">
          <div className="flex-1 text-center">{title}</div>
          <div className="p-1 flex cursor-pointer rounded-full hover:bg-primary-300/50">
            <MaterialSymbol onClick={onDelete} icon="delete" />
          </div>
        </div>
      }
    >
      <div className="flex h-full w-full flex-col">
        <div className="flex h-full w-full flex-col items-start gap-2 overflow-auto pb-2">
          <Block.Item label="Sender">
            {sender && (
              <div className="flex items-center">
                <Avatar size={24} url={sender.imageUrl} name={sender.name} />
                <span className="ml-1">{sender.name}</span>
              </div>
            )}
          </Block.Item>
          <Block.Item label="Type">
            <Pill className="bg-blue">{type}</Pill>
          </Block.Item>
          <Block.Item label="Time">
            {new Date(createTime).toLocaleString()}
          </Block.Item>
          <Block.Item
            label="Description"
            className="mt-2 min-h-40 w-full rounded-lg bg-primary-100"
          >
            <div className="whitespace-pre-wrap">{description}</div>
          </Block.Item>
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

export const NotificationPage = () => {
  useSideBar({ activeKey: 'notifications' });
  const [notificationList, setNotificationList] = useState<Notification[]>();
  const [isFetched, setIsFetched] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState<Notification>();

  const fetchNotifications = async () => {
    try {
      const data = await api.notification.getNotifications();
      setNotificationList(data);
      return data;
    } catch (error) {
      setNotificationList([]);
    }
  };

  useEffect(() => {
    (async () => {
      setIsFetched(false);
      await fetchNotifications();
      setIsFetched(true);
    })();
  }, []);

  const fetchNotificationDetail = async (id: number) => {
    const data = await api.notification.getNotificationsDetail({
      pathParams: { nid: id },
    });
    setSelectedDetail(data);
  };

  return (
    <PaperLayout>
      <PaperLayout.Title>ADVENTURE REPORTS</PaperLayout.Title>
      <PaperLayout.Content>
        {(() => {
          if (!isFetched)
            return <Loading className="text-5xl text-primary-300" />;
          if (!notificationList?.length)
            return (
              <div className="text-5xl text-primary-300">
                No Notification! :D
              </div>
            );
          return (
            <>
              <div className="flex h-full w-full flex-col gap-2 overflow-auto p-2">
                {notificationList.map(({ id, ...data }) => (
                  <NotificationBar
                    onClick={() => {
                      fetchNotificationDetail(id);
                      fetchNotifications();
                    }}
                    id={id}
                    key={id}
                    focus={selectedDetail?.id === id}
                    {...data}
                  />
                ))}
              </div>
              {selectedDetail ? (
                <NotificationDetailBlock
                  detail={selectedDetail}
                  className="h-full w-full"
                  onFootBtnClick={async () => {
                    await api.notification.patchNotifications({
                      pathParams: { nid: selectedDetail.id },
                    });
                    await fetchNotificationDetail(selectedDetail.id);
                  }}
                  onDelete={async () => {
                    await api.notification.deleteNotification({
                      pathParams: { nid: selectedDetail.id },
                    });
                    setSelectedDetail(undefined);
                    fetchNotifications();
                  }}
                />
              ) : (
                <EmptyNotificationDetail className="h-full w-full" />
              )}
            </>
          );
        })()}
      </PaperLayout.Content>
    </PaperLayout>
  );
};
