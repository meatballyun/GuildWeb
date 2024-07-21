import { RowDataPacket } from 'mysql2';

export interface TemplateItem extends RowDataPacket {
  id: number;
  templateId: number;
  content: string;
  active: boolean;
}
