// src/lib/apiBase.js
export const API_BASE = import.meta.env.VITE_API_URL;

export function authHeader() {
  const token = localStorage.getItem("jwt");
  return token ? { Authorization: `Bearer ${token}` } : {};
}