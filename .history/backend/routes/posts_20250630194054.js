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

// Blog principal (todos los posts)
router.get("/", (req, res) => {
  const posts = readPosts();
  res.json(posts);
});

// Blog personal de cada usuario
router.get("/user/:username", (req, res) => {
  const posts = readPosts();
  const { username } = req.params;
  const filtered = posts.filter((p) => p.author === username);
  res.json(filtered);
});

// Un solo post por slug (público)
router.get("/:slug", (req, res) => {
  const { slug } = req.params;
  const posts = readPosts();

  const post = posts.find((p) => p.slug === slug);
  if (!post) return res.status(404).json({ error: "No encontrado" });

  const html = marked.parse(post.body || "");
  const words = (post.body || "").trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 200));

  res.json({ 
    ...post, 
    html, 
    minutes,
    likes: post.likes || [],
    comments: post.comments || []
  });
});

// Crear nuevo post (PROTEGIDO)
router.post("/", verifyToken, (req, res) => {
  const posts = readPosts();
  const { username } = req.user;

  if (!username) {
    return res.status(400).json({ message: "Tu perfil no tiene username." });
  }

  const newPost = {
    ...req.body,
    author: username,
    likes: [],
    comments: []
  };

  posts.push(newPost);
  writePosts(posts);
  res.status(201).json({ message: "Artículo creado." });
});

// Editar post existente (solo autor)
router.put("/:slug", verifyToken, (req, res) => {
  const { slug } = req.params;
  const { username } = req.user;
  const updatedPost = req.body;

  const posts = readPosts();
  const index = posts.findIndex((p) => p.slug === slug);

  if (index === -1) return res.status(404).json({ message: "Artículo no encontrado." });

  if (posts[index].author !== username) {
    return res.status(403).json({ message: "No tienes permisos para editar este post." });
  }

  // Preservar likes y comentarios al editar
  posts[index] = { 
    ...posts[index], 
    ...updatedPost, 
    author: username,
    likes: posts[index].likes || [],
    comments: posts[index].comments || []
  };
  writePosts(posts);

  res.json({ message: "Artículo actualizado." });
});

// Eliminar post existente (solo autor)
router.delete("/:slug", verifyToken, (req, res) => {
  const { slug } = req.params;
  const { username } = req.user;

  const posts = readPosts();
  const index = posts.findIndex((p) => p.slug === slug);

  if (index === -1) return res.status(404).json({ message: "Artículo no encontrado." });

  if (posts[index].author !== username) {
    return res.status(403).json({ message: "No tienes permisos para eliminar este post." });
  }

  posts.splice(index, 1);
  writePosts(posts);

  res.json({ message: "Artículo eliminado." });
});

/* --------------------------------------------------------
   Dar like a un post
-------------------------------------------------------- */
router.post("/:slug/like", verifyToken, (req, res) => {
  const { slug } = req.params;
  const { username } = req.user;

  if (!username) {
    return res.status(400).json({ message: "Debes completar tu perfil primero" });
  }

  const posts = readPosts();
  const postIndex = posts.findIndex((p) => p.slug === slug);

  if (postIndex === -1) {
    return res.status(404).json({ message: "Post no encontrado" });
  }

  if (!posts[postIndex].likes) {
    posts[postIndex].likes = [];
  }

  // Toggle like
  const likeIndex = posts[postIndex].likes.indexOf(username);
  if (likeIndex === -1) {
    posts[postIndex].likes.push(username);
  } else {
    posts[postIndex].likes.splice(likeIndex, 1);
  }

  writePosts(posts);
  res.json({ 
    likes: posts[postIndex].likes,
    userLiked: likeIndex === -1
  });
});

/* --------------------------------------------------------
   Comentar en un post
-------------------------------------------------------- */
router.post("/:slug/comment", verifyToken, (req, res) => {
  const { slug } = req.params;
  const { username } = req.user;
  const { content } = req.body;

  if (!username) {
    return res.status(400).json({ message: "Debes completar tu perfil primero" });
  }

  if (!content || content.trim() === "") {
    return res.status(400).json({ message: "El comentario no puede estar vacío" });
  }

  const posts = readPosts();
  const postIndex = posts.findIndex((p) => p.slug === slug);

  if (postIndex === -1) {
    return res.status(404).json({ message: "Post no encontrado" });
  }

  if (!posts[postIndex].comments) {
    posts[postIndex].comments = [];
  }

  const newComment = {
    id: Date.now().toString(),
    author: username,
    content: content.trim(),
    date: new Date().toISOString()
  };

  posts[postIndex].comments.push(newComment);
  writePosts(posts);

  res.json({ 
    message: "Comentario agregado",
    comment: newComment
  });
});

/* --------------------------------------------------------
   Eliminar comentario (solo autor del comentario)
-------------------------------------------------------- */
router.delete("/:slug/comment/:commentId", verifyToken, (req, res) => {
  const { slug, commentId } = req.params;
  const { username } = req.user;

  const posts = readPosts();
  const postIndex = posts.findIndex((p) => p.slug === slug);

  if (postIndex === -1) {
    return res.status(404).json({ message: "Post no encontrado" });
  }

  const comments = posts[postIndex].comments || [];
  const commentIndex = comments.findIndex(c => c.id === commentId);

  if (commentIndex === -1) {
    return res.status(404).json({ message: "Comentario no encontrado" });
  }

  if (comments[commentIndex].author !== username) {
    return res.status(403).json({ message: "No puedes eliminar este comentario" });
  }

  comments.splice(commentIndex, 1);
  posts[postIndex].comments = comments;
  writePosts(posts);

  res.json({ message: "Comentario eliminado" });
});

export default router;