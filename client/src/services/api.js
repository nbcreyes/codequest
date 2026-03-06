// Axios instance pre-configured for the CodeQuest API.
// Interceptors automatically attach the correct token to every request
// and handle 401 responses globally.

import axios from "axios";
import useAuthStore from "@/store/authStore";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000, // 15 second timeout
});

// ── Request interceptor ───────────────────────────────────────────────────
// Attaches the parent token to every outgoing request.
// Individual service functions can override this by passing their own headers.

api.interceptors.request.use(
  (config) => {
    const { parentToken } = useAuthStore.getState();

    if (parentToken) {
      config.headers.Authorization = `Bearer ${parentToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor ──────────────────────────────────────────────────
// Handles 401 responses globally by clearing auth state.
// This means if a token expires, the user is logged out automatically.

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth state — the router will redirect to login
      useAuthStore.getState().clearAuth();
    }

    return Promise.reject(error);
  }
);

export default api;