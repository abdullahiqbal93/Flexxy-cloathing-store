import axios from "axios";

export function getJWTToken() {
  const token = document.cookie.split('; ').find(row => row.startsWith('authToken='));
  return token ? token.split('=')[1] : null;
}

const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/v1`,
  withCredentials: true,
});

// Add request interceptor to add token to all requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getJWTToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Clear token on unauthorized response
      document.cookie = 'authToken=; Max-Age=0; path=/; secure; SameSite=Strict';
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const getAxios = () => axiosInstance;

export async function getAxiosWithToken() {
  const token = getJWTToken();
  if (!token) {
    throw new Error("Token not found");
  }
  return axiosInstance;
}
