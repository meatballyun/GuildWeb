import { BASE_API_URL } from './constants';
import { fetchJson } from './utils';

const BASE_USER_URL = `${BASE_API_URL}/users`;

export const getUser = ({ params }) =>
  fetchJson({
    url: `${BASE_API_URL}/users?q=${params.q}`,
    method: 'GET',
  });

export const getUserMe = () =>
  fetchJson({ url: `${BASE_USER_URL}/me`, method: 'GET' });

export const putUserMe = ({ body }) =>
  fetchJson({ url: `${BASE_USER_URL}/me`, method: 'PUT', body });

export const postUserFriend = ({ body }) =>
  fetchJson({
    url: `${BASE_USER_URL}/invitation`,
    method: 'POST',
    body,
  });

// ------------- Friend ------------- //

export const getUserFriend = ({ params }) =>
  fetchJson({
    url: `${BASE_USER_URL}/friends?q=${params.q}`,
    method: 'GET',
  });

export const putUserFriendStatus = ({ body }) =>
  fetchJson({
    url: `${BASE_USER_URL}/friends`,
    method: 'PUT',
    body,
  });

export const deleteUserFriend = ({ pathParams }) =>
  fetchJson({
    url: `${BASE_USER_URL}/friends/${pathParams.id}`,
    method: 'DELETE',
  });
