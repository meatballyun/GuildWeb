import { RowDataPacket } from 'mysql2';

export interface CommonColumn extends RowDataPacket {
  id: number;
  createTime: Date;
  updateTime: Date;
  active?: boolean;
}
