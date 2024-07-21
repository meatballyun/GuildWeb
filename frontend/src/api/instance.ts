import axios from 'axios';

export const baseInstance = axios.create({
  baseURL: '/api',
});

if (localStorage.getItem('token')) {
  baseInstance.defaults.headers.common['Authorization'] =
    `Bearer ${localStorage.getItem('token')}`;
}
