import { RowDataPacket } from 'mysql2';
import { TemplateItem } from './missionTemplateItem';

export interface Item extends RowDataPacket, Omit<TemplateItem, 'templateId'> {
  missionId: number;
}
