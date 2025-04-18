import axios from "axios";

export function getJWTToken() {
  return sessionStorage.getItem("authToken");
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
      console.log("✅ Token added to request:", token); // <-- Add this
    } else {
      console.log("❌ No token found in sessionStorage");
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      sessionStorage.removeItem("authToken"); 
      window.location.href = "/login";
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
