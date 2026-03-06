// Separate Axios instance for child session API calls.
// Uses the child token instead of the parent token.

import axios from "axios";
import useAuthStore from "@/store/authStore";

const childApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

childApi.interceptors.request.use(
  (config) => {
    const { childToken } = useAuthStore.getState();

    if (childToken) {
      config.headers.Authorization = `Bearer ${childToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

childApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().clearChildSession();
    }
    return Promise.reject(error);
  }
);

export default childApi;