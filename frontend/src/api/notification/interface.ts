import { CommonColumn } from '../interface';
import { User } from '../user/interface';

export type NotificationType = 'guild' | 'system' | 'user';

export interface BaseNotification {
  sender: User;
  recipientId: number;
  type: NotificationType;
  title: string;
  description: string;
  read: boolean;
  used: boolean;
}

export interface Notification extends BaseNotification, CommonColumn {}
