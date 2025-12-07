import axios from 'axios';
import { API_BASE_URL } from '@env';
import { clearSession, getSession } from './session';

declare const __DEV__: boolean;

export const api = axios.create({
  baseURL: API_BASE_URL,
});

// Attach Authorization header from SecureStore on every request
api.interceptors.request.use(async (config) => {
  const { token } = await getSession();
  if (token) {
    config.headers = config.headers || {};
    if (!config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } else {
    // Dev-only visibility to understand missing auth in requests
    if (__DEV__) {
      console.warn('[api] No auth token for request to', config.url);
    }
  }
  return config;
});

// Basic 401 handling: clear session so the app can redirect to login
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await clearSession();
    }
    return Promise.reject(error);
  }
);
