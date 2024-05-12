import { BASE_API_URL } from './constants';
import { fetchJson } from './utils';

const BASE_GUILD_URL = `${BASE_API_URL}/guilds`;

// ------------- guild ------------- //
export const getGuilds = () =>
  fetchJson({ url: `${BASE_GUILD_URL}`, method: 'GET' });

export const getGuildsDetail = ({ pathParams = { gid: -1 } }) =>
  fetchJson({
    url: `${BASE_GUILD_URL}/${pathParams.gid}`,
    method: 'GET',
  });

export const postGuilds = ({ body }) =>
  fetchJson({
    url: `${BASE_GUILD_URL}`,
    method: 'POST',
    body,
  });

export const postCabin = () =>
  fetchJson({
    url: `${BASE_GUILD_URL}/cabin`,
    method: 'POST',
  });

export const putGuilds = ({ body, pathParams }) =>
  fetchJson({
    url: `${BASE_GUILD_URL}/${pathParams.gid}`,
    method: 'PUT',
    body,
  });

export const deleteGuilds = ({ pathParams = { gid: -1 } }) =>
  fetchJson({
    url: `${BASE_GUILD_URL}/${pathParams.gid}`,
    method: 'DELETE',
  });

// ------------- member ------------- //
export const postGuildsInvitation = ({ pathParams, body }) =>
  fetchJson({
    url: `${BASE_GUILD_URL}/${pathParams.gid}/invitation`,
    method: 'POST',
    body,
  });

export const getGuildsInvitation = ({ pathParams, body }) =>
  fetchJson({
    url: `${BASE_GUILD_URL}/${pathParams.gid}/invitation`,
    method: 'GET',
  });

export const getGuildsMember = ({ pathParams = { gid: -1 } }) =>
  fetchJson({
    url: `${BASE_GUILD_URL}/${pathParams.gid}/members`,
    method: 'GET',
  });

export const patchGuildsMember = ({
  pathParams = { gid: -1, uid: -1 },
  body,
}) =>
  fetchJson({
    url: `${BASE_GUILD_URL}/${pathParams.gid}/members/${pathParams.uid}`,
    method: 'PATCH',
    body,
  });

export const deleteGuildsMember = ({ pathParams = { gid: -1, uid: -1 } }) =>
  fetchJson({
    url: `${BASE_GUILD_URL}/${pathParams.gid}/members/${pathParams.uid}`,
    method: 'DELETE',
  });

// ------------- task -------------//
export const getGuildsTasks = ({
  pathParams = { gid: -1 },
  params = { q: '' },
}) =>
  fetchJson({
    url: `${BASE_GUILD_URL}/${pathParams.gid}/tasks?q=${params.q}`,
    method: 'GET',
  });

export const getGuildsTasksDetail = ({ pathParams = { gid: -1, tid: -1 } }) =>
  fetchJson({
    url: `${BASE_GUILD_URL}/${pathParams.gid}/tasks/${pathParams.tid}`,
    method: 'GET',
  });

export const postGuildsTasks = ({ pathParams = { gid: -1 }, body }) =>
  fetchJson({
    url: `${BASE_GUILD_URL}/${pathParams.gid}/tasks`,
    method: 'POST',
    body,
  });

export const putGuildsTasks = ({ pathParams = { gid: -1, tid: -1 }, body }) =>
  fetchJson({
    url: `${BASE_GUILD_URL}/${pathParams.gid}/tasks/${pathParams.tid}`,
    method: 'PUT',
    body,
  });

export const deleteGuildsTasks = ({ pathParams = { gid: -1, tid: -1 } }) =>
  fetchJson({
    url: `${BASE_GUILD_URL}/${pathParams.gid}/tasks/${pathParams.tid}`,
    method: 'DELETE',
  });

// ------------- update task status -------------//

export const getGuildsTasksAccepted = ({ pathParams = { gid: -1, tid: -1 } }) =>
  fetchJson({
    url: `${BASE_GUILD_URL}/${pathParams.gid}/tasks/${pathParams.tid}/accepted`,
    method: 'GET',
  });

export const getGuildsTasksAbandon = ({ pathParams = { gid: -1, tid: -1 } }) =>
  fetchJson({
    url: `${BASE_GUILD_URL}/${pathParams.gid}/tasks/${pathParams.tid}/abandon`,
    method: 'GET',
  });

export const patchGuildsTasksCancel = ({
  pathParams = { gid: -1, tid: -1 },
  body,
}) =>
  fetchJson({
    url: `${BASE_GUILD_URL}/${pathParams.gid}/tasks/${pathParams.tid}/cancel`,
    method: 'PATCH',
    body,
  });

export const patchGuildsTasksRestore = ({
  pathParams = { gid: -1, tid: -1 },
  body,
}) =>
  fetchJson({
    url: `${BASE_GUILD_URL}/${pathParams.gid}/tasks/${pathParams.tid}/restore`,
    method: 'PATCH',
    body,
  });

export const patchGuildsTasksComplete = ({
  pathParams = { gid: -1, tid: -1 },
  body,
}) =>
  fetchJson({
    url: `${BASE_GUILD_URL}/${pathParams.gid}/tasks/${pathParams.tid}/complete`,
    method: 'PATCH',
    body,
  });

export const patchGuildsTasksSubmit = ({
  pathParams = { gid: -1, tid: -1 },
  body,
}) =>
  fetchJson({
    url: `${BASE_GUILD_URL}/${pathParams.gid}/tasks/${pathParams.tid}/submit`,
    method: 'PATCH',
    body,
  });

export const patchTasksCheckbox = ({ pathParams = { gid: -1 }, body }) =>
  fetchJson({
    url: `${BASE_GUILD_URL}/${pathParams.gid}/tasks/checkbox`,
    method: 'PATCH',
    body,
  });

export const getAllTasks = () =>
  fetchJson({
    url: `${BASE_GUILD_URL}/all/tasks`,
    method: 'GET',
  });

export const getTemplate = ({ pathParams = { gid: -1 } }) =>
  fetchJson({
    url: `${BASE_GUILD_URL}/${pathParams.gid}/task_templates`,
    method: 'GET',
  });

export const getTemplateDetail = ({ pathParams = { gid: -1, ttid: -1 } }) =>
  fetchJson({
    url: `${BASE_GUILD_URL}/${pathParams.gid}/task_templates/${pathParams.ttid}`,
    method: 'GET',
  });

export const postTemplate = ({ pathParams = { gid: -1, ttid: -1 }, body }) =>
  fetchJson({
    url: `${BASE_GUILD_URL}/${pathParams.gid}/task_templates`,
    method: 'POST',
    body,
  });

export const putTemplate = ({ pathParams = { gid: -1, ttid: -1 }, body }) =>
  fetchJson({
    url: `${BASE_GUILD_URL}/${pathParams.gid}/task_templates/${pathParams.ttid}`,
    method: 'PUT',
    body,
  });

export const deleteTemplate = ({ pathParams = { gid: -1, ttid: -1 } }) =>
  fetchJson({
    url: `${BASE_GUILD_URL}/${pathParams.gid}/task_templates/${pathParams.ttid}`,
    method: 'DELETE',
  });
