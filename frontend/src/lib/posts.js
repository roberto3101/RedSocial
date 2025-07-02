// src/lib/posts.js
export const API_BASE = import.meta.env.VITE_API_URL;

function authHeader() {
  const token = localStorage.getItem("jwt");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

const API_URL = `${API_BASE}/api/posts`;

export async function getPosts() {
  const res = await fetch(API_URL, { headers: authHeader() });
  return await res.json();
}

export async function getPostBySlug(slug) {
  const res = await fetch(`${API_URL}/${slug}`, { headers: authHeader() });
  if (!res.ok) throw new Error("Artículo no encontrado");
  return await res.json();
}

export async function createPost(newPost) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(newPost),
  });
  return await res.json();
}

export async function updatePost(slug, updatedPost) {
  const res = await fetch(`${API_URL}/${slug}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(updatedPost),
  });
  return await res.json();
}

export async function deletePost(slug) {
  const res = await fetch(`${API_URL}/${slug}`, {
    method: 'DELETE',
    headers: authHeader(),
  });
  return await res.json();
}