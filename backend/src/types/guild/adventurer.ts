import { RowDataPacket } from 'mysql2';

export type Status = 'accepted' | 'completed' | 'failed';

export interface Adventurer extends RowDataPacket {
  taskId: number;
  userId: number;
  createTime: Date;
  updateTime: Date;
  acceptanceTime: Date;
  completedTime: Date;
  status: Status;
}
