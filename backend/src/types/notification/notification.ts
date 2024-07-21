import { CommonColumn } from '../common';

export type NotificationType = 'guild' | 'system' | 'user';

export interface BaseNotification {
  senderId: number;
  recipientId: number;
  type: NotificationType;
  title: string;
  description: string;
  read: boolean;
  used: boolean;
}

export interface Notification extends BaseNotification, CommonColumn {}
