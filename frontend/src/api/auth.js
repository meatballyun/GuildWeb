import { BASE_API_URL } from './constants';
import { fetchJson } from './utils';

export const login = ({ body }) =>
  fetchJson({ url: `${BASE_API_URL}/login`, method: 'POST', body });

export const logout = () =>
  fetchJson({ url: `${BASE_API_URL}/logout`, method: 'GET' });

export const checkAuth = (token) =>
  fetchJson({
    url: `${BASE_API_URL}/checkAuth`,
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });

export const signUp = ({ body }) =>
  fetchJson({
    url: `${BASE_API_URL}/signup`,
    method: 'POST',
    body,
  });

export const signUpValidation = ({ pathParams }) =>
  fetchJson({
    url: `${BASE_API_URL}/signup?${pathParams}`,
    method: 'GET',
  });

export const getUserMe = () =>
  fetchJson({ url: `${BASE_API_URL}/user/me`, method: 'GET' });

export const editUserSetting = ({ body }) =>
  fetchJson({ url: `${BASE_API_URL}/user/me`, method: 'PUT', body });

export const getUserFriend = ({ params }) =>
  fetchJson({
    url: `${BASE_API_URL}/user/friend?q=${params.q}`,
    method: 'GET',
  });

export const getUser = ({ params }) =>
  fetchJson({
    url: `${BASE_API_URL}/user?q=${params.q}`,
    method: 'GET',
  });

export const updateUserFriendStatus = ({ body }) =>
  fetchJson({
    url: `${BASE_API_URL}/user/friend`,
    method: 'PUT',
    body,
  });

export const postUserFriend = ({ body }) =>
  fetchJson({
    url: `${BASE_API_URL}/user`,
    method: 'POST',
    body,
  });

export const deleteUserFriend = ({ pathParams }) =>
  fetchJson({
    url: `${BASE_API_URL}/user/friend/${pathParams.id}`,
    method: 'DELETE',
  });
