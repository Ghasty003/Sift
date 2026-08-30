import { useAuthStore } from "@/store/authStore";
import axios from "axios";

// Set VITE_API_BASE_URL in .env for staging/production; falls back to the
// local dev server described in the API spec.
const baseURL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080/api/v1";

export const apiClient = axios.create({ baseURL });

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Token missing/expired/invalid — drop it and let route guards redirect
    // to /login. Not calling `navigate()` here on purpose: this file has no
    // router context, and coupling it to one would make it untestable.
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  },
);
