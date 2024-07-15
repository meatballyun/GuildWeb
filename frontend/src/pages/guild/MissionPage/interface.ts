import { MissionStatus, MissionType } from '../../../api/guild/interface';
import { FILTER_LIST } from './constants';

type FilterType = (typeof FILTER_LIST)[number]['name'];

export interface Query {
  filter?: 'mine' | 'established' | FilterType;
  missionType?: MissionType[];
  missionStatus?: MissionStatus[];
}

export enum MissionButtonType {
  EDIT = 'edit',
  ACCEPT = 'accept',
  COMPLETE = 'complete',
  SUBMIT = 'submit',
  ABANDON = 'abandon',
  RESTORE = 'restore',
  CANCEL = 'cancel',
  DISABLE = 'disable',
  ENABLE = 'enable',
  DELETE = 'delete',
}

export enum MissionPageMode {
  MANAGE = 'manage',
  TEMPLATE = 'template',
}
