const API_URL = 'http://localhost:3001/posts';

export async function getPosts() {
  const res = await fetch(API_URL);
  return await res.json();
}

export async function createPost(newPost) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newPost),
  });
  return await res.json();
}

export async function updatePost(id, updatedPost) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedPost),
  });
  return await res.json();
}

export async function deletePost(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
  return await res.json();
}
