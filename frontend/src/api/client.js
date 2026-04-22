import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';

export const api = axios.create({
  baseURL: API_BASE
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  const tenantId = localStorage.getItem('tenantId') || '00000000-0000-0000-0000-000000000001';
  if (token) config.headers.Authorization = `Bearer ${token}`;
  config.headers['x-tenant-id'] = tenantId;
  return config;
});
