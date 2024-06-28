import { CommonColumn } from '../common';
import { TaskTemplateType } from './taskTemplate';

export type TaskType = TaskTemplateType | 'emergency' | 'ordinary';
export type Status = 'established' | 'in progress' | 'completed' | 'expired' | 'cancelled';
export type Accepted = 'pending acceptance' | 'max accepted';

export interface TaskTime {
  initiationTime: Date | string;
  deadline: Date | string;
}

export interface TaskInfo {
  name: string;
  type: TaskType;
  status?: Status;
  description?: string;
  maxAdventurer: number;
  adventurer?: number;
  accepted?: Accepted;
}

export interface Task extends TaskTime, TaskInfo, CommonColumn {
  creatorId: number;
  guildId: number;
  templateId?: number;
}
