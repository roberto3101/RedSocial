// src/lib/api.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,  // ⇒ https://d315m7tpvzh3ta.cloudfront.net
  withCredentials: true                   // cookies SameSite=None; Secure
});

// Añade el JWT (si existe) a cada petición
api.interceptors.request.use(config => {
  const token = localStorage.getItem("jwt");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;