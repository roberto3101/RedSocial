// backend/routes/posts.js
import { Router } from "express";
import fs from "fs";
import path from "path";
import { marked } from "marked";

const router = Router();
const filePath = path.resolve("data/posts.json");

// Función auxiliar
const readPosts = () => {
  const data = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(data);
};

// Leer todos los posts
router.get("/", (req, res) => {
  const posts = readPosts();
  res.json(posts);
});

// Obtener un post por slug
router.get("/:slug", (req, res) => {
  const { slug } = req.params;
  const posts = readPosts();

  const post = posts.find((p) => p.slug === slug);
  if (!post) return res.status(404).json({ error: "No encontrado" });

  const html = marked.parse(post.body || "");
  const words = (post.body || "").trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 200));

  res.json({ ...post, html, minutes });
});

// Agregar un nuevo post
router.post("/", (req, res) => {
  const newPost = req.body;
  const posts = readPosts();

  posts.push(newPost);
  fs.writeFileSync(filePath, JSON.stringify(posts, null, 2));
  res.status(201).json({ message: "Artículo creado." });
});

// Editar un post existente
router.put("/:slug", (req, res) => {
  const { slug } = req.params;
  const updatedPost = req.body;

  const posts = readPosts();
  const index = posts.findIndex((p) => p.slug === slug);
  if (index === -1) return res.status(404).json({ message: "Artículo no encontrado." });

  posts[index] = { ...posts[index], ...updatedPost };
  fs.writeFileSync(filePath, JSON.stringify(posts, null, 2));

  res.json({ message: "Artículo actualizado." });
});

// Eliminar un post
router.delete("/:slug", (req, res) => {
  const { slug } = req.params;

  let posts = readPosts();
  posts = posts.filter((p) => p.slug !== slug);
  fs.writeFileSync(filePath, JSON.stringify(posts, null, 2));

  res.json({ message: "Artículo eliminado." });
});

export default router;
