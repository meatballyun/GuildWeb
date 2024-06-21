import { RowDataPacket } from 'mysql2';

export type Status = 'confirmed' | 'pending' | 'blocked';

export interface UserFriend extends RowDataPacket {
  createTime: Date;
  updateTime: Date;
  user1Id: number;
  user2Id: number;
  status: Status;
}
