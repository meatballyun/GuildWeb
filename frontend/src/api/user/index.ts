import { baseInstance } from '../instance';
import type { APIRequestConfig, APIResponseData } from '../interface';
import type { BaseUser, Status, User, UserMe } from './interface';

export const getUser = async ({ params }: APIRequestConfig<{ q?: string }>) => {
  const url = `/users`;
  const res = await baseInstance.get<APIResponseData<User[]>>(url, { params });
  return res.data.data;
};

export const getUserMe = async () => {
  const url = `/users/me`;
  const res = await baseInstance.get<APIResponseData<UserMe>>(url);
  return res.data.data;
};

export const putUserMe = async ({
  data,
}: APIRequestConfig<never, BaseUser>) => {
  const url = `/users/me`;
  const res = await baseInstance.put<APIResponseData>(url, data);
  return res.data;
};

export const postUserFriend = async ({
  data,
}: APIRequestConfig<never, { uid: number }>) => {
  const url = `/users/invitation`;
  const res = await baseInstance.post<APIResponseData>(url, data);
  return res.data;
};

// ------------- Friend ------------- //

export const getUserFriend = async ({
  params,
}: APIRequestConfig<{ q: string }>) => {
  const url = `/users/friends`;
  const res = await baseInstance.get<APIResponseData<User[]>>(url, { params });
  return res.data.data;
};

export const putUserFriendStatus = async ({
  pathParams,
  data,
}: APIRequestConfig<never, { status: Status }, { uid: number }>) => {
  const url = `/users/friends/${pathParams?.uid}`;
  const res = await baseInstance.put<APIResponseData>(url, data);
  return res.data.data;
};

export const deleteUserFriend = async ({
  pathParams,
}: APIRequestConfig<never, never, { id: number }>) => {
  const url = `/users/friends/${pathParams?.id}`;
  const res = await baseInstance.delete<APIResponseData>(url);
  return res.data.data;
};
