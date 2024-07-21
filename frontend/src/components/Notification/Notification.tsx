import { useMemo, useState } from 'react';
import { classNames } from '../../utils';
import { Loading } from '../Loading';
import { MaterialSymbol } from '../MaterialSymbol';
import { defaultNotificationValue } from './constants';
import type { NotificationElementProps, NotificationParam } from './interface';

export const useNotification = () => {
  const [notification, setNotification] = useState<
    NotificationParam | undefined
  >(defaultNotificationValue);
  const { enableClose, type, message } = notification ?? {};

  const promptNotification = (params?: NotificationParam) => {
    setNotification(params);
  };

  const handleClose = () => {
    setNotification(defaultNotificationValue);
  };

  const Element = useMemo(() => {
    switch (type) {
      case 'error':
        return Notification.Error;
      case 'warning':
        return Notification.Warning;
      case 'loading':
        return Notification.Loading;
      case 'success':
        return Notification.Success;
      default:
        return NullElement;
    }
  }, [type]);

  const canClose = enableClose ?? type !== 'loading';

  return {
    value: notification,
    Dom: (props: Omit<NotificationElementProps, 'onClose' | 'children'>) => (
      <Element {...props} onClose={canClose ? handleClose : undefined}>
        {message}
      </Element>
    ),
    promptNotification,
  };
};

const NullElement = () => {
  return null;
};

export const Notification = ({
  children,
  className,
  onClose,
}: NotificationElementProps) => {
  return (
    <div
      className={classNames(
        'flex w-full items-center justify-between rounded-md border border-currentColor px-2 py-1 text-paragraph-p3',
        className
      )}
    >
      <span className="flex items-center">{children}</span>
      {onClose && (
        <MaterialSymbol
          icon="close"
          className="cursor-pointer text-primary-400 hover:text-primary-300"
          onClick={onClose}
        />
      )}
    </div>
  );
};

Notification.Success = ({
  className,
  children,
  onClose,
}: NotificationElementProps) => (
  <Notification
    className={classNames('bg-green/20 text-green', className)}
    onClose={onClose}
  >
    <MaterialSymbol icon="check_circle" size={16} className="mr-1" fill />
    {children ?? 'Success'}
  </Notification>
);

Notification.Warning = ({
  className,
  children,
  onClose,
}: NotificationElementProps) => (
  <Notification
    className={classNames('bg-orange/20 text-orange', className)}
    onClose={onClose}
  >
    <MaterialSymbol icon="warning" size={16} className="mr-1" fill />
    {children ?? 'Warning'}
  </Notification>
);

Notification.Error = ({
  className,
  children,
  onClose,
}: NotificationElementProps) => (
  <Notification
    className={classNames('bg-red/20 text-red', className)}
    onClose={onClose}
  >
    <MaterialSymbol icon="error" size={16} className="mr-1" fill />
    {children ?? 'Error'}
  </Notification>
);

Notification.Loading = ({
  className,
  children,
  onClose,
}: NotificationElementProps) => {
  return (
    <Notification
      className={classNames('bg-primary-300/20 text-primary-300', className)}
      onClose={onClose}
    >
      {children ?? <Loading />}
    </Notification>
  );
};
