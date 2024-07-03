import { CommonColumn } from '../interface';
import { User } from '../user/interface';

export type AdventurerStatus = 'accepted' | 'completed' | 'failed';

export interface Adventurer extends Omit<User, 'status'>, CommonColumn {
  taskId: number;
  userId: number;
  createTime: Date;
  updateTime: Date;
  acceptanceTime: Date;
  completedTime: Date;
  status: AdventurerStatus;
}

export type Membership = 'Master' | 'Vice' | 'Regular' | 'Pending';
export interface BaseGuild {
  leaderId: number;
  name: string;
  description?: string;
  imageUrl: string;
  cabin?: boolean;
  published?: boolean;
}

export interface Guild extends BaseGuild, CommonColumn {
  membership: Membership;
}

export interface GuildsMember
  extends Pick<User, 'id' | 'name' | 'imageUrl' | 'rank'> {
  membership: Membership;
}

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

export interface TaskTemplate
  extends TaskTemplateTime,
    TaskTemplateInfo,
    CommonColumn {}

export type TaskType = TaskTemplateType | 'emergency' | 'ordinary';
export type TaskStatus =
  | 'established'
  | 'in progress'
  | 'completed'
  | 'expired'
  | 'cancelled';
export type Accepted = 'pending acceptance' | 'max accepted';

export interface TaskTime {
  initiationTime: Date | string;
  deadline: Date | string;
}

export interface TaskInfo {
  name: string;
  type: TaskType;
  status?: TaskStatus;
  description?: string;
  maxAdventurer: number;
  adventurer?: number;
  accepted?: Accepted;
}

export interface Task extends TaskTime, TaskInfo, CommonColumn {
  items: {
    id: number;
    content: string;
    status?: 0 | 1;
  }[];
  adventurers: Adventurer[];
  creator: User;
  guild: Guild;
  gid: string;
  isAccepted?: boolean;
  templateId?: number;
}
