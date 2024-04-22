import { BASE_API_URL } from './constants';
import { fetchJson } from './utils';

export const getGuild = () =>
  fetchJson({ url: `${BASE_API_URL}/guild`, method: 'GET' });

export const getGuildDetail = ({ pathParams }) =>
  fetchJson({
    url: `${BASE_API_URL}/guild/${pathParams.id}`,
    method: 'GET',
  });

export const deleteGuild = ({ pathParams }) =>
  fetchJson({
    url: `${BASE_API_URL}/guild/${pathParams.id}`,
    method: 'DELETE',
  });

export const getGuildMember = ({ pathParams }) =>
  fetchJson({
    url: `${BASE_API_URL}/guild/${pathParams.id}/member`,
    method: 'GET',
  });

export const patchGuildMember = ({ pathParams, body }) =>
  fetchJson({
    url: `${BASE_API_URL}/guild/${pathParams.id}/member`,
    method: 'PATCH',
    body,
  });

export const deleteGuildMember = ({ pathParams }) =>
  fetchJson({
    url: `${BASE_API_URL}/guild/${pathParams.id}/member/${pathParams.userId}`,
    method: 'DELETE',
  });

export const addNewGuild = ({ body }) =>
  fetchJson({
    url: `${BASE_API_URL}/guild`,
    method: 'POST',
    body,
  });

export const addNewGuildMember = ({ pathParams, body }) =>
  fetchJson({
    url: `${BASE_API_URL}/guild/${pathParams.id}/member`,
    method: 'POST',
    body,
  });

export const editGuild = ({ body, pathParams }) =>
  fetchJson({
    url: `${BASE_API_URL}/guild/${pathParams.id}`,
    method: 'PUT',
    body,
  });

export const getTasks = ({ pathParams, params }) =>
  fetchJson({
    url: `${BASE_API_URL}/guild/${pathParams.gid}/task?q=${params.q}`,
    method: 'GET',
  });

export const getTaskDetail = ({ pathParams }) =>
  fetchJson({
    url: `${BASE_API_URL}/guild/${pathParams.gid}/task/${pathParams.tid}`,
    method: 'GET',
  });

export const acceptedTask = ({ pathParams }) =>
  fetchJson({
    url: `${BASE_API_URL}/guild/${pathParams.gid}/task/${pathParams.tid}/accepted`,
    method: 'GET',
  });

export const createTask = ({ pathParams, body }) =>
  fetchJson({
    url: `${BASE_API_URL}/guild/${pathParams.gid}/task`,
    method: 'POST',
    body,
  });

export const editTask = ({ pathParams, body }) =>
  fetchJson({
    url: `${BASE_API_URL}/guild/${pathParams.gid}/task/${pathParams.tid}`,
    method: 'PUT',
    body,
  });

export const deleteTask = ({ pathParams }) =>
  fetchJson({
    url: `${BASE_API_URL}/guild/${pathParams.gid}/task/${pathParams.tid}`,
    method: 'DELETE',
  });
