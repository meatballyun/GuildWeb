import { RowDataPacket } from 'mysql2';
import { TemplateItem } from './taskTemplateItem';

export interface Item extends RowDataPacket, Omit<TemplateItem, 'templateId'> {
  taskId: number;
}
