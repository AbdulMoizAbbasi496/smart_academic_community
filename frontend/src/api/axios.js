// src/api/axios.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: false,
});

api.interceptors.request.use((config) => {
  try {
    const raw = localStorage.getItem("user");
    if (raw) {
      const { token } = JSON.parse(raw);
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {}
  return config;
});

// Global response error handler
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status;
    const msg = err.response?.data?.message || err.message || "Request failed";
    if (status === 401) {
      // session expired / invalid token -> force logout
      localStorage.removeItem("user");
      // user-friendly message then redirect
      alert("Session expired. Please log in again.");
      window.location.href = "/login";
    } else if (status === 403) {
      // forbidden: show a friendly message
      alert(msg || "You don't have permission to do that.");
    }
    return Promise.reject(err);
  }
);

export default api;
