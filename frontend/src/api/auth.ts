import { baseInstance } from './instance';
import type { APIRequestConfig, APIResponseData } from './interface';

export const login = async ({
  data,
}: APIRequestConfig<never, { email: string; password: string }>) => {
  const url = '/users/login';
  const res = await baseInstance.post<APIResponseData<{ token: string }>>(
    url,
    data
  );
  return res.data.data;
};

export const logout = async () => {
  const url = '/users/logout';
  const res = await baseInstance.get<APIResponseData>(url);
  return res.data;
};

export const signUp = async ({
  data,
}: APIRequestConfig<
  never,
  { name: string; email: string; password: string }
>) => {
  const url = '/users/signup';
  const res = await baseInstance.post<APIResponseData>(url, data);
  return res.data;
};

export const signUpValidation = async ({
  params,
}: APIRequestConfig<{ uid: string; code: string }>) => {
  const url = '/emails/validation-signup';
  const res = await baseInstance.get<APIResponseData>(url, { params });
  return res.data;
};

export const resendEmail = async ({
  data,
}: APIRequestConfig<never, { email: string }>) => {
  const url = '/emails/resend';
  const res = await baseInstance.post<APIResponseData>(url, data);
  return res.data;
};

export const resetPasswordEmail = async ({
  data,
}: APIRequestConfig<never, { email: string }>) => {
  const url = '/emails/reset-password';
  const res = await baseInstance.post<APIResponseData>(url, data);
  return res.data;
};

export const resetPasswordValidation = async ({
  params,
}: APIRequestConfig<{ id: string }>) => {
  const url = '/emails/validation-reset-password';
  const res = await baseInstance.get<APIResponseData>(url, { params });
  return res.data;
};

export const resetPassword = async ({
  data,
}: APIRequestConfig<
  never,
  { uid: number; code: string; password: string }
>) => {
  const url = '/emails/reset-password';
  const res = await baseInstance.post<APIResponseData>(url, data);
  return res.data;
};
