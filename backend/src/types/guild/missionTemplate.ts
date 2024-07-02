import { CommonColumn } from '../common';

export type MissionTemplateType = 'daily' | 'weekly' | 'monthly';

export interface MissionTemplateTime {
  generationTime: Date | string;
  deadline: Date | string;
}

export interface MissionTemplateInfo {
  enabled?: boolean;
  type: MissionTemplateType;
  name: string;
  description?: string;
  maxAdventurer: number;
}

export interface MissionTemplate extends MissionTemplateTime, MissionTemplateInfo, CommonColumn {}
