import { Router } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const profilesPath = path.resolve(__dirname, "../data/profiles.json");
const postsPath = path.resolve(__dirname, "../data/posts.json");

const router = Router();

function readProfiles() {
  try {
    if (!fs.existsSync(profilesPath)) return [];
    const raw = fs.readFileSync(profilesPath, "utf8");
    const profiles = JSON.parse(raw);
    return Array.isArray(profiles) ? profiles : [];
  } catch {
    return [];
  }
}

function readPosts() {
  try {
    if (!fs.existsSync(postsPath)) return [];
    const raw = fs.readFileSync(postsPath, "utf8");
    const posts = JSON.parse(raw);
    return Array.isArray(posts) ? posts : [];
  } catch {
    return [];
  }
}

router.get("/", (req, res) => {
  const { q = "", type = "users" } = req.query;
  const query = q.toLowerCase().trim();

  if (!query) return res.json([]);

  if (type === "users") {
    const profiles = readProfiles();
    const results = profiles
      .filter(
        (p) =>
          (p.username && p.username.toLowerCase().includes(query)) ||
          (p.firstName && p.firstName.toLowerCase().includes(query)) ||
          (p.lastName && p.lastName.toLowerCase().includes(query)) ||
          (p.email && p.email.toLowerCase().includes(query))
      )
      .map((p) => ({
        username: p.username,
        name: `${p.firstName || ""} ${p.lastName || ""}`.trim(),
        avatar: p.avatar || "/default-avatar.png",
        _id: p.userId || p.username,
        about: p.about || "",
      }))
      .slice(0, 7);

    return res.json(Array.isArray(results) ? results : []);
  }

  if (type === "posts") {
    const posts = readPosts();
    const results = posts
      .filter(
        (p) =>
          p.title && p.title.toLowerCase().includes(query)
      )
      .map((p) => ({
        _id: p.slug || p.id,
        title: p.title,
        authorUsername: p.author,
      }))
      .slice(0, 7);

    return res.json(Array.isArray(results) ? results : []);
  }

  res.json([]);
});

export default router;

//backend\routes\search.js