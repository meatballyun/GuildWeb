import { baseInstance } from '../instance';
import { APIRequestConfig, APIResponseData } from '../interface';
import {
  BaseGuild,
  Guild,
  GuildsMember,
  Membership,
  Mission,
  MissionInfo,
  MissionTemplate,
  MissionTemplateInfo,
  MissionTemplateTime,
  MissionTime,
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

// ------------- mission -------------//
export const getGuildsMissions = async ({
  pathParams,
  params,
}: APIRequestConfig<{ q?: string }, never, { gid?: string }>) => {
  const url = `/guilds/${pathParams?.gid}/missions`;
  const res = await baseInstance.get<APIResponseData<Mission[]>>(url, {
    params,
  });
  return res.data;
};

export const getGuildsMissionsDetail = async ({
  pathParams,
}: APIRequestConfig<never, never, { gid?: string; tid: number }>) => {
  const url = `/guilds/${pathParams?.gid}/missions/${pathParams?.tid}`;
  const res = await baseInstance.get<APIResponseData<Mission>>(url);
  return res.data.data;
};

export const postGuildsMissions = async ({
  pathParams,
  data,
}: APIRequestConfig<never, MissionInfo & MissionTime, { gid?: string }>) => {
  const url = `/guilds/${pathParams?.gid}/missions`;
  const res = await baseInstance.post<APIResponseData<Mission>>(url, data);
  return res.data.data;
};

export const putGuildsMissions = async ({
  pathParams,
  data,
}: APIRequestConfig<
  never,
  MissionInfo & MissionTime,
  { gid?: string; tid?: number | null }
>) => {
  const url = `/guilds/${pathParams?.gid}/missions/${pathParams?.tid}`;
  const res = await baseInstance.post<APIResponseData<Mission>>(url, data);
  return res.data.data;
};

export const deleteGuildsMissions = async ({
  pathParams,
}: APIRequestConfig<never, never, { gid?: string; tid: number | null }>) => {
  const url = `/guilds/${pathParams?.gid}/missions/${pathParams?.tid}`;
  const res = await baseInstance.delete<APIResponseData<Mission>>(url);
  return res.data;
};

// ------------- update mission status -------------//

export const getGuildsMissionsAccepted = async ({
  pathParams,
}: APIRequestConfig<never, never, { gid?: string; tid?: number | null }>) => {
  const url = `/guilds/${pathParams?.gid}/missions/${pathParams?.tid}/accepted`;
  const res = await baseInstance.patch<APIResponseData>(url);
  return res.data;
};

export const getGuildsMissionsAbandon = async ({
  pathParams,
}: APIRequestConfig<never, never, { gid?: string; tid?: number | null }>) => {
  const url = `/guilds/${pathParams?.gid}/missions/${pathParams?.tid}/abandon`;
  const res = await baseInstance.patch<APIResponseData>(url);
  return res.data;
};

export const patchGuildsMissionsCancel = async ({
  pathParams,
}: APIRequestConfig<never, never, { gid?: string; tid?: number | null }>) => {
  const url = `/guilds/${pathParams?.gid}/missions/${pathParams?.tid}/cancel`;
  const res = await baseInstance.patch<APIResponseData>(url);
  return res.data;
};

export const patchGuildsMissionsRestore = async ({
  pathParams,
}: APIRequestConfig<never, never, { gid?: string; tid?: number | null }>) => {
  const url = `/guilds/${pathParams?.gid}/missions/${pathParams?.tid}/restore`;
  const res = await baseInstance.patch<APIResponseData>(url);
  return res.data;
};

export const patchGuildsMissionsComplete = async ({
  pathParams,
}: APIRequestConfig<never, never, { gid?: string; tid?: number | null }>) => {
  const url = `/guilds/${pathParams?.gid}/missions/${pathParams?.tid}/complete`;
  const res = await baseInstance.patch<APIResponseData>(url);
  return res.data;
};

export const patchGuildsMissionsSubmit = async ({
  pathParams,
}: APIRequestConfig<never, never, { gid?: string; tid?: number | null }>) => {
  const url = `/guilds/${pathParams?.gid}/missions/${pathParams?.tid}/submit`;
  const res = await baseInstance.patch<APIResponseData>(url);
  return res.data;
};

export const patchMissionsCheckbox = async ({
  pathParams,
  data,
}: APIRequestConfig<never, { itemRecordId?: number }, { gid?: string }>) => {
  const url = `/guilds/${pathParams?.gid}/missions`;
  const res = await baseInstance.patch<APIResponseData>(url, data);
  return res.data;
};

export const getAllMissions = async () => {
  const url = `/guilds/all/missions`;
  const res = await baseInstance.get<APIResponseData<Mission[]>>(url);
  return res.data.data;
};

export const getTemplate = async ({
  params,
  pathParams,
}: APIRequestConfig<{ q?: string }, never, { gid?: string }>) => {
  const url = `/guilds/${pathParams?.gid}/mission_templates`;
  const res = await baseInstance.get<APIResponseData<MissionTemplate[]>>(url, {
    params,
  });
  return res.data.data;
};

export const getTemplateDetail = async ({
  pathParams,
}: APIRequestConfig<never, never, { gid?: string; ttid: number }>) => {
  const url = `/guilds/${pathParams?.gid}/mission_templates/${pathParams?.ttid}`;
  const res = await baseInstance.get<APIResponseData<MissionTemplate>>(url);
  return res.data.data;
};

export const postTemplate = async ({
  pathParams,
  data,
}: APIRequestConfig<
  never,
  MissionTemplateInfo & MissionTemplateTime,
  { gid?: string }
>) => {
  const url = `/guilds/${pathParams?.gid}/mission_templates`;
  const res = await baseInstance.post<APIResponseData<MissionTemplate>>(
    url,
    data
  );
  return res.data.data;
};

export const putTemplate = async ({
  pathParams,
  data,
}: APIRequestConfig<
  never,
  MissionTemplateInfo & MissionTemplateTime,
  { gid?: string; ttid?: number | null }
>) => {
  const url = `/guilds/${pathParams?.gid}/mission_templates/${pathParams?.ttid}`;
  const res = await baseInstance.put<APIResponseData<MissionTemplate>>(
    url,
    data
  );
  return res.data.data;
};

export const deleteTemplate = async ({
  pathParams,
}: APIRequestConfig<never, never, { gid?: string; ttid: number | null }>) => {
  const url = `/guilds/${pathParams?.gid}/mission_templates/${pathParams?.ttid}`;
  const res = await baseInstance.delete<APIResponseData<MissionTemplate>>(url);
  return res.data.data;
};
