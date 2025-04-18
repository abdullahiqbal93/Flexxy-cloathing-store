import axios from "axios";

export function getJWTToken() {
  const token = document.cookie.split('; ').find(row => row.startsWith('authToken='));
  return token ? token.split('=')[1] : null;
}

const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/v1`,
  withCredentials: true,
});

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

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      document.cookie = 'authToken=; Max-Age=0; path=/; secure; SameSite=Lax; domain=' + window.location.hostname;
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
