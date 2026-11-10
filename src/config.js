import axios from 'axios';

let rawUrl = import.meta.env.VITE_API_URL || 'https://duka-poa.onrender.com';
rawUrl = rawUrl.replace(/\/api\/v1\/?$/, '').replace(/\/api\/?$/, '').replace(/\/+$/, '');

export const API_BASE_URL = rawUrl;

// Pre-configured Axios instance for all live endpoints
export const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  timeout: 45000,
});

// 💥 AUTOMATICALLY ATTACHES THE LOGIN TOKEN TO EVERY CALL 💥
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token') || localStorage.getItem('token');
  if (token && token !== 'undefined' && token !== 'null') {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-redirect to login if unauthenticated
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      if (!currentPath.includes('/login') && !currentPath.includes('/register')) {
        localStorage.clear();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default API_BASE_URL;
