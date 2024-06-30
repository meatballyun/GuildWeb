import { CommonColumn } from '../common';

export type TaskTemplateType = 'daily' | 'weekly' | 'monthly';

export interface TaskTemplateTime {
  generationTime: Date | string;
  deadline: Date | string;
}

export interface TaskTemplateInfo {
  enabled?: boolean;
  type: TaskTemplateType;
  name: string;
  description?: string;
  maxAdventurer: number;
}

export interface TaskTemplate extends TaskTemplateTime, TaskTemplateInfo, CommonColumn {}
