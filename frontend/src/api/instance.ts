import axios from 'axios';

const token = localStorage.token;

export const baseInstance = axios.create({
  baseURL: '/api',
  headers: {
    Authorization: token && `Bearer ${token}`,
  },
});
