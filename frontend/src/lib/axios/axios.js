import axios from "axios";

export function getJWTToken() {
  return sessionStorage.getItem("authToken");
}

export const getAxios = () => {
  const axiosInstance = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/v1`,
    withCredentials: true,
  });

  axiosInstance.interceptors.request.use(
    (config) => {
      const token = getJWTToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log("✅ Token added to request:", token); // Should print now
      } else {
        console.log("❌ No token found in sessionStorage");
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        sessionStorage.removeItem("authToken");
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};



