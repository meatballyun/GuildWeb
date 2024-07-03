import { baseInstance } from '../instance';
import type { APIRequestConfig, APIResponseData } from '../interface';
import type { Notification } from './interface';

export const getNotifications = async () => {
  const url = `/notifications`;
  const res = await baseInstance.get<APIResponseData<Notification[]>>(url);
  return res.data.data;
};

export const getNotificationsDetail = async ({
  pathParams,
}: APIRequestConfig<never, never, { nid?: number }>) => {
  const url = `/notifications/${pathParams?.nid}`;
  const res = await baseInstance.get<APIResponseData<Notification>>(url);
  return res.data.data;
};

export const patchNotifications = async ({
  pathParams,
}: APIRequestConfig<never, never, { nid?: number }>) => {
  const url = `/notifications/${pathParams?.nid}`;
  const res = await baseInstance.patch<APIResponseData>(url);
  return res.data.data;
};

export const deleteNotification = async ({
  pathParams,
}: APIRequestConfig<never, never, { nid?: number }>) => {
  const url = `/notifications/${pathParams?.nid}`;
  const res = await baseInstance.delete<APIResponseData>(url);
  return res.data.data;
};
