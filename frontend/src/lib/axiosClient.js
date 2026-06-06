import axios from "axios";

import { TOKEN_STORAGE_KEYS } from "./constants.js";


const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000/api",
  timeout: 20000,
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEYS.access);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let pendingRequests = [];

function flushPending(error, token = null) {
  pendingRequests.forEach((callback) => callback(error, token));
  pendingRequests = [];
}

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const refreshToken = localStorage.getItem(TOKEN_STORAGE_KEYS.refresh);

    if (error.response?.status !== 401 || originalRequest?._retry || !refreshToken) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingRequests.push((refreshError, token) => {
          if (refreshError) {
            reject(refreshError);
            return;
          }
          originalRequest.headers.Authorization = `Bearer ${token}`;
          resolve(axiosClient(originalRequest));
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const response = await axios.post(`${axiosClient.defaults.baseURL}/auth/token/refresh/`, {
        refresh: refreshToken,
      });
      const nextAccess = response.data.access;
      const nextRefresh = response.data.refresh ?? refreshToken;
      localStorage.setItem(TOKEN_STORAGE_KEYS.access, nextAccess);
      localStorage.setItem(TOKEN_STORAGE_KEYS.refresh, nextRefresh);
      axiosClient.defaults.headers.common.Authorization = `Bearer ${nextAccess}`;
      flushPending(null, nextAccess);
      originalRequest.headers.Authorization = `Bearer ${nextAccess}`;
      return axiosClient(originalRequest);
    } catch (refreshError) {
      localStorage.removeItem(TOKEN_STORAGE_KEYS.access);
      localStorage.removeItem(TOKEN_STORAGE_KEYS.refresh);
      localStorage.removeItem(TOKEN_STORAGE_KEYS.user);
      window.dispatchEvent(new Event("hisabsathi:logout"));
      flushPending(refreshError);
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default axiosClient;
