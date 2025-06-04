// src/lib/posts.js
const API_URL = 'http://localhost:3001/api/posts';

export async function getPosts() {
  const res = await fetch(API_URL);
  return await res.json();
}

export async function getPostBySlug(slug) {
  const res = await fetch(`${API_URL}/${slug}`);
  if (!res.ok) throw new Error("Artículo no encontrado");
  return await res.json();
}
