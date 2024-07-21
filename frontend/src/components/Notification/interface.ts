export interface NotificationParam {
  type: '' | 'error' | 'warning' | 'loading' | 'success';
  message?: string;
  enableClose?: boolean;
}

export interface NotificationElementProps {
  children: React.ReactNode;
  className?: string;
  onClose?: () => void;
}
