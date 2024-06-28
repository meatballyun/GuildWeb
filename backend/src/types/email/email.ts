import { CommonColumn } from '../common';

export type Status = 'confirmed' | 'pending' | 'failed';

export type EmailType = 'signUp' | 'forgotPassword';

export interface ConfirmationEmail extends CommonColumn {
  userId: number;
  status: Status;
  type: EmailType;
  code: string;
}
