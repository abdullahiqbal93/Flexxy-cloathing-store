import axios from 'axios';
import store from './store/index';
import { invalidateUser } from './store/features/user/userSlice';

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth headers
axiosInstance.interceptors.request.use(
  (config) => {
    // Get auth token from cookie
    const authToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('authToken='));

    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken.split('=')[1]}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth state on 401 Unauthorized
      store.dispatch(invalidateUser());
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;