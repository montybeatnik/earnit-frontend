import axios from 'axios';
import { API_BASE_URL } from '@env';
import { clearSession, getSession } from './session';

declare const __DEV__: boolean;

const resolvedBaseURL =
  API_BASE_URL ||
  (typeof process !== 'undefined' ? process.env.EXPO_PUBLIC_API_BASE_URL : '') ||
  'http://localhost:8080';

if (__DEV__ && !API_BASE_URL) {
  console.warn('[api] API_BASE_URL missing from env, using', resolvedBaseURL);
}

export const api = axios.create({
  baseURL: resolvedBaseURL,
});

// Attach Authorization header from SecureStore on every request
api.interceptors.request.use(async (config) => {
  // Allow opt-out per request
  if ((config as any).skipAuth || config.headers?.['X-Skip-Auth']) {
    return config;
  }

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
