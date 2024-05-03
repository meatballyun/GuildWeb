import { BASE_API_URL } from './constants';
import { fetchJson } from './utils';

const BASE_NOTIFICATION_URL = `${BASE_API_URL}/notifications`;

export const getNotifications = () =>
  fetchJson({ url: BASE_NOTIFICATION_URL, method: 'GET' });

export const getNotificationsDetail = ({ pathParams = { nid: -1 } }) =>
  fetchJson({
    url: `${BASE_NOTIFICATION_URL}/${pathParams.nid}`,
    method: 'GET',
  });

export const patchNotifications = ({ pathParams = { nid: -1 } }) =>
  fetchJson({
    url: `${BASE_NOTIFICATION_URL}/${pathParams.nid}`,
    method: 'PATCH',
  });

export const deleteNotification = ({ pathParams = { nid: -1 } }) =>
  fetchJson({
    url: `${BASE_NOTIFICATION_URL}/${pathParams.nid}`,
    method: 'Delete',
  });
