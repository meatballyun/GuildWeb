import { baseInstance } from '../instance';
import { APIRequestConfig, APIResponseData } from '../interface';
import {
  BaseGuild,
  Guild,
  GuildsMember,
  Membership,
  Task,
  TaskInfo,
  TaskTemplate,
  TaskTemplateInfo,
  TaskTemplateTime,
  TaskTime,
} from './interface';

// ------------- guild ------------- //
export const getGuilds = async () => {
  const url = '/guilds';
  const res = await baseInstance.get<APIResponseData<Guild[]>>(url);
  return res.data.data;
};

export const getGuildsDetail = async ({
  pathParams,
}: APIRequestConfig<never, never, { gid?: string }>) => {
  const url = `/guilds/${pathParams?.gid}`;
  const res = await baseInstance.get<APIResponseData<Guild>>(url);
  return res.data.data;
};

export const postGuilds = async ({
  data,
}: APIRequestConfig<never, BaseGuild>) => {
  const url = `/guilds`;
  const res = await baseInstance.post<APIResponseData<Guild>>(url, data);
  return res.data.data;
};

export const postCabin = async () => {
  const url = `/guilds/cabin`;
  const res = await baseInstance.post<APIResponseData<Guild>>(url);
  return res.data.data;
};

export const putGuilds = async ({
  data,
  pathParams,
}: APIRequestConfig<never, BaseGuild, { gid?: string }>) => {
  const url = `/guilds/${pathParams?.gid}`;
  const res = await baseInstance.put<APIResponseData<Guild>>(url, data);
  return res.data.data;
};

export const deleteGuilds = async ({
  pathParams,
}: APIRequestConfig<never, never, { gid?: string }>) => {
  const url = `/guilds/${pathParams?.gid}`;
  const res = await baseInstance.delete<APIResponseData<Guild>>(url);
  return res.data.data;
};

// ------------- member ------------- //
export const postGuildsInvitation = async ({
  pathParams,
  data,
}: APIRequestConfig<never, { uid: number }, { gid?: string }>) => {
  const url = `/guilds/${pathParams?.gid}/invitation`;
  const res = await baseInstance.post<APIResponseData<Guild>>(url, data);
  return res.data.data;
};

export const getGuildsInvitation = async ({
  pathParams,
}: APIRequestConfig<never, BaseGuild, { gid: number }>) => {
  const url = `/guilds/${pathParams?.gid}/invitation`;
  const res = await baseInstance.get<APIResponseData<Guild>>(url);
  return res.data.data;
};

export const getGuildsMember = async ({
  pathParams,
}: APIRequestConfig<never, never, { gid?: string }>) => {
  const url = `/guilds/${pathParams?.gid}/members`;
  const res = await baseInstance.get<APIResponseData<GuildsMember[]>>(url);
  return res.data.data;
};

export const patchGuildsMember = async ({
  pathParams,
  data,
}: APIRequestConfig<
  never,
  { membership: Membership },
  { gid?: string; uid?: number }
>) => {
  const url = `/guilds/${pathParams?.gid}/members/${pathParams?.uid}`;
  const res = await baseInstance.patch(url, data);
  return res.data;
};

export const deleteGuildsMember = async ({
  pathParams,
}: APIRequestConfig<never, never, { gid?: string; uid?: number }>) => {
  const url = `/guilds/${pathParams?.gid}/members/${pathParams?.uid}`;
  const res = await baseInstance.delete(url);
  return res.data;
};

// ------------- task -------------//
export const getGuildsTasks = async ({
  pathParams,
  params,
}: APIRequestConfig<{ q?: string }, never, { gid?: string }>) => {
  const url = `/guilds/${pathParams?.gid}/tasks`;
  const res = await baseInstance.get<APIResponseData<Task[]>>(url, { params });
  return res.data;
};

export const getGuildsTasksDetail = async ({
  pathParams,
}: APIRequestConfig<never, never, { gid?: string; tid: number }>) => {
  const url = `/guilds/${pathParams?.gid}/tasks/${pathParams?.tid}`;
  const res = await baseInstance.get<APIResponseData<Task>>(url);
  return res.data.data;
};

export const postGuildsTasks = async ({
  pathParams,
  data,
}: APIRequestConfig<never, TaskInfo & TaskTime, { gid?: string }>) => {
  const url = `/guilds/${pathParams?.gid}/tasks`;
  const res = await baseInstance.post<APIResponseData<Task>>(url, data);
  return res.data.data;
};

export const putGuildsTasks = async ({
  pathParams,
  data,
}: APIRequestConfig<
  never,
  TaskInfo & TaskTime,
  { gid?: string; tid?: number | null }
>) => {
  const url = `/guilds/${pathParams?.gid}/tasks/${pathParams?.tid}`;
  const res = await baseInstance.post<APIResponseData<Task>>(url, data);
  return res.data.data;
};

export const deleteGuildsTasks = async ({
  pathParams,
}: APIRequestConfig<never, never, { gid?: string; tid: number | null }>) => {
  const url = `/guilds/${pathParams?.gid}/tasks/${pathParams?.tid}`;
  const res = await baseInstance.delete<APIResponseData<Task>>(url);
  return res.data;
};

// ------------- update task status -------------//

export const getGuildsTasksAccepted = async ({
  pathParams,
}: APIRequestConfig<never, never, { gid?: string; tid?: number | null }>) => {
  const url = `/guilds/${pathParams?.gid}/tasks/${pathParams?.tid}/accepted`;
  const res = await baseInstance.patch<APIResponseData>(url);
  return res.data;
};

export const getGuildsTasksAbandon = async ({
  pathParams,
}: APIRequestConfig<never, never, { gid?: string; tid?: number | null }>) => {
  const url = `/guilds/${pathParams?.gid}/tasks/${pathParams?.tid}/abandon`;
  const res = await baseInstance.patch<APIResponseData>(url);
  return res.data;
};

export const patchGuildsTasksCancel = async ({
  pathParams,
}: APIRequestConfig<never, never, { gid?: string; tid?: number | null }>) => {
  const url = `/guilds/${pathParams?.gid}/tasks/${pathParams?.tid}/cancel`;
  const res = await baseInstance.patch<APIResponseData>(url);
  return res.data;
};

export const patchGuildsTasksRestore = async ({
  pathParams,
}: APIRequestConfig<never, never, { gid?: string; tid?: number | null }>) => {
  const url = `/guilds/${pathParams?.gid}/tasks/${pathParams?.tid}/restore`;
  const res = await baseInstance.patch<APIResponseData>(url);
  return res.data;
};

export const patchGuildsTasksComplete = async ({
  pathParams,
}: APIRequestConfig<never, never, { gid?: string; tid?: number | null }>) => {
  const url = `/guilds/${pathParams?.gid}/tasks/${pathParams?.tid}/complete`;
  const res = await baseInstance.patch<APIResponseData>(url);
  return res.data;
};

export const patchGuildsTasksSubmit = async ({
  pathParams,
}: APIRequestConfig<never, never, { gid?: string; tid?: number | null }>) => {
  const url = `/guilds/${pathParams?.gid}/tasks/${pathParams?.tid}/submit`;
  const res = await baseInstance.patch<APIResponseData>(url);
  return res.data;
};

export const patchTasksCheckbox = async ({
  pathParams,
  data,
}: APIRequestConfig<never, { itemRecordId?: number }, { gid?: string }>) => {
  const url = `/guilds/${pathParams?.gid}/tasks`;
  const res = await baseInstance.patch<APIResponseData>(url, data);
  return res.data;
};

export const getAllTasks = async () => {
  const url = `/guilds/all/tasks`;
  const res = await baseInstance.get<APIResponseData<Task[]>>(url);
  return res.data.data;
};

export const getTemplate = async ({
  params,
  pathParams,
}: APIRequestConfig<{ q?: string }, never, { gid?: string }>) => {
  const url = `/guilds/${pathParams?.gid}/task_templates`;
  const res = await baseInstance.get<APIResponseData<TaskTemplate[]>>(url, {
    params,
  });
  return res.data.data;
};

export const getTemplateDetail = async ({
  pathParams,
}: APIRequestConfig<never, never, { gid?: string; ttid: number }>) => {
  const url = `/guilds/${pathParams?.gid}/task_templates/${pathParams?.ttid}`;
  const res = await baseInstance.get<APIResponseData<TaskTemplate>>(url);
  return res.data.data;
};

export const postTemplate = async ({
  pathParams,
  data,
}: APIRequestConfig<
  never,
  TaskTemplateInfo & TaskTemplateTime,
  { gid?: string }
>) => {
  const url = `/guilds/${pathParams?.gid}/task_templates`;
  const res = await baseInstance.post<APIResponseData<TaskTemplate>>(url, data);
  return res.data.data;
};

export const putTemplate = async ({
  pathParams,
  data,
}: APIRequestConfig<
  never,
  TaskTemplateInfo & TaskTemplateTime,
  { gid?: string; ttid?: number | null }
>) => {
  const url = `/guilds/${pathParams?.gid}/task_templates/${pathParams?.ttid}`;
  const res = await baseInstance.put<APIResponseData<TaskTemplate>>(url, data);
  return res.data.data;
};

export const deleteTemplate = async ({
  pathParams,
}: APIRequestConfig<never, never, { gid?: string; ttid: number | null }>) => {
  const url = `/guilds/${pathParams?.gid}/task_templates/${pathParams?.ttid}`;
  const res = await baseInstance.delete<APIResponseData<TaskTemplate>>(url);
  return res.data.data;
};
