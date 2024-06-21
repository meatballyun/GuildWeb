import { RowDataPacket } from 'mysql2';

export type Membership = 'master' | 'vice' | 'regular' | 'pending';

export interface UserGuildRelation extends RowDataPacket {
  createTime: Date;
  updateTime: Date;
  userId: number;
  guildId: number;
  membership: Membership;
}
