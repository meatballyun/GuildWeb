import { RowDataPacket } from 'mysql2';

export interface ItemRecord extends RowDataPacket {
  id: number;
  itemId: number;
  userId: number;
  content: string;
  status: boolean;
  active: boolean;
}
