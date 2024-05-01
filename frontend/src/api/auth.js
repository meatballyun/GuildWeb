import { BASE_API_URL } from './constants';
import { fetchJson } from './utils';

export const login = ({ body }) =>
  fetchJson({ url: `${BASE_API_URL}/users/login`, method: 'POST', body });

export const logout = () =>
  fetchJson({ url: `${BASE_API_URL}/users/logout`, method: 'GET' });

export const checkAuth = (token) =>
  fetchJson({
    url: `${BASE_API_URL}/users/checkAuth`,
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });

export const signUp = ({ body }) =>
  fetchJson({
    url: `${BASE_API_URL}/users/signup`,
    method: 'POST',
    body,
  });

export const signUpValidation = ({ pathParams }) =>
  fetchJson({
    url: `${BASE_API_URL}/emails/validation-signup?${pathParams}`,
    method: 'GET',
  });

export const resendEmail = ({ body = { email: '' } }) =>
  fetchJson({
    url: `${BASE_API_URL}/emails/resend`,
    method: 'POST',
    body,
  });
