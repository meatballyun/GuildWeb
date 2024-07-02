import { CommonColumn } from '../common';
import { MissionTemplateType } from './missionTemplate';

export type MissionType = MissionTemplateType | 'emergency' | 'ordinary';
export type Status = 'established' | 'in progress' | 'completed' | 'expired' | 'cancelled';
export type Accepted = 'pending acceptance' | 'max accepted';

export interface MissionTime {
  initiationTime: Date | string;
  deadline: Date | string;
}

export interface MissionInfo {
  name: string;
  type: MissionType;
  status?: Status;
  description?: string;
  maxAdventurer: number;
  adventurer?: number;
  accepted?: Accepted;
}

export interface Mission extends MissionTime, MissionInfo, CommonColumn {
  creatorId: number;
  guildId: number;
  templateId?: number;
}
