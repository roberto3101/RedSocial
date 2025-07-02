import { Router } from "express";
import fs from "fs";
import path from "path";
import { marked } from "marked";
import { verifyToken } from "../middleware/auth.js";

const router = Router();
const filePath = process.env.NODE_ENV === "production"
  ? "/tmp/posts.json"
  : path.resolve("data/posts.json");

const readPosts = () => {
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
};
const writePosts = (posts) => {
  fs.writeFileSync(filePath, JSON.stringify(posts, null, 2));
};

// --- Blog principal (todos los posts, filtra luego si quieres solo admin)
router.get("/", (req, res) => {
  const posts = readPosts();
  res.json(posts);
});

// --- Blog personal de cada usuario
router.get("/user/:username", (req, res) => {
  const posts = readPosts();
  const { username } = req.params;
  const filtered = posts.filter((p) => p.author === username);
  res.json(filtered);
});

// --- Un solo post por slug (público)
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

// --- Crear nuevo post (PROTEGIDO)
router.post("/", verifyToken, (req, res) => {
  const posts = readPosts();
  const { username } = req.user;

  if (!username) {
    return res.status(400).json({ message: "Tu perfil no tiene username." });
  }

  const newPost = {
    ...req.body,
    author: username // Siempre fuerza el author con el username real
  };

  posts.push(newPost);
  writePosts(posts);
  res.status(201).json({ message: "Artículo creado." });
});

// --- Editar post existente (solo autor)
router.put("/:slug", verifyToken, (req, res) => {
  const { slug } = req.params;
  const { username } = req.user;
  const updatedPost = req.body;

  const posts = readPosts();
  const index = posts.findIndex((p) => p.slug === slug);

  if (index === -1) return res.status(404).json({ message: "Artículo no encontrado." });

  // Solo el autor puede editar
  if (posts[index].author !== username) {
    return res.status(403).json({ message: "No tienes permisos para editar este post." });
  }

  posts[index] = { ...posts[index], ...updatedPost, author: username };
  writePosts(posts);

  res.json({ message: "Artículo actualizado." });
});

// --- Eliminar post existente (solo autor)
router.delete("/:slug", verifyToken, (req, res) => {
  const { slug } = req.params;
  const { username } = req.user;

  const posts = readPosts();
  const index = posts.findIndex((p) => p.slug === slug);

  if (index === -1) return res.status(404).json({ message: "Artículo no encontrado." });

  // Solo el autor puede eliminar
  if (posts[index].author !== username) {
    return res.status(403).json({ message: "No tienes permisos para eliminar este post." });
  }

  posts.splice(index, 1);
  writePosts(posts);

  res.json({ message: "Artículo eliminado." });
});

export default router;