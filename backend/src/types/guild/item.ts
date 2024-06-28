import { RowDataPacket } from 'mysql2';

export interface Item extends RowDataPacket {
  id: number;
  taskId: number;
  content: string;
  active: boolean;
}
