import { CommonColumn } from '../interface';
import { User } from '../user/interface';

export type AdventurerStatus = 'accepted' | 'completed' | 'failed';

export interface Adventurer extends Omit<User, 'status'>, CommonColumn {
  missionId: number;
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

export interface MissionTemplate
  extends MissionTemplateTime,
    MissionTemplateInfo,
    CommonColumn {}

export type MissionType = MissionTemplateType | 'emergency' | 'ordinary';
export type MissionStatus =
  | 'established'
  | 'in progress'
  | 'completed'
  | 'expired'
  | 'cancelled';
export type Accepted = 'pending acceptance' | 'max accepted';

export interface MissionTime {
  initiationTime: Date | string;
  deadline: Date | string;
}

export interface MissionInfo {
  name: string;
  type: MissionType;
  status?: MissionStatus;
  description?: string;
  maxAdventurer: number;
  adventurer?: number;
  accepted?: Accepted;
}

export interface Mission extends MissionTime, MissionInfo, CommonColumn {
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
