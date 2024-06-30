import { CommonColumn } from '../common';

export interface BaseGuild {
  leaderId: number;
  name: string;
  description?: string;
  imageUrl: string;
  cabin?: boolean;
  published?: boolean;
}

export interface Guild extends BaseGuild, CommonColumn {}
