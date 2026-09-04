import axios from 'axios';
import config from '../constants/config';
import { getToken } from '../utils/storage';

const api = axios.create({
  baseURL: config.apiBaseUrl,
  timeout: config.apiTimeout,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request Interceptor: Attach JWT Token
api.interceptors.request.use(
  async (requestConfig) => {
    try {
      const token = await getToken();
      if (token) {
        requestConfig.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.warn('[API Interceptor] Could not fetch token:', error);
    }
    return requestConfig;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Normalize responses and catch errors cleanly
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    let message = 'Network connection failed. Please check your internet or server.';

    if (error.response && error.response.data) {
      message = error.response.data.message || error.response.data.error || message;
    } else if (error.message) {
      message = error.message;
    }

    return Promise.reject({
      message,
      status: error.response ? error.response.status : 500,
      data: error.response ? error.response.data : null,
    });
  }
);

export default api;
