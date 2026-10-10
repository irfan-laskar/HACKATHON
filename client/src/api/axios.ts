import axios from 'axios';
import { handleMockRequest } from './mockEngine';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api'),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: check for HTML fallback from Vercel static rewrites or offline server
api.interceptors.response.use(
  (response) => {
    const rawContentType = response.headers?.['content-type'];
    const contentType = typeof rawContentType === 'string' ? rawContentType : String(rawContentType || '');
    if (typeof response.data === 'string' && contentType.includes('text/html')) {
      const mock = handleMockRequest(response.config);
      if (mock) {
        return mock;
      }
    }
    return response;
  },
  async (error) => {
    const config = error.config;
    const status = error.response?.status;

    // Handle Network Error, 404, 405 (Vercel static rewrite method not allowed), or 500+
    if (!status || status === 404 || status === 405 || status >= 500) {
      try {
        const mock = handleMockRequest(config);
        if (mock) {
          return mock;
        }
      } catch (mockErr: any) {
        // If mock explicitly threw (e.g. 401 invalid credentials)
        return Promise.reject(mockErr);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
