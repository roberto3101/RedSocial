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
    if (!fs.existsSync(profilesPath)) {
      console.log("❌ Archivo profiles.json NO existe en:", profilesPath);
      return [];
    }
    const raw = fs.readFileSync(profilesPath, "utf8");
    const profiles = JSON.parse(raw);
    console.log("📁 Profiles leídos correctamente, total:", profiles.length);
    return Array.isArray(profiles) ? profiles : [];
  } catch (error) {
    console.log("🚨 Error leyendo profiles:", error.message);
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

  console.log("🔍 Search request - Query:", query, "Type:", type);

  if (!query) {
    console.log("❌ Query vacío, retornando array vacío");
    return res.json([]);
  }

  if (type === "users") {
    console.log("👥 Buscando usuarios...");
    
    const profiles = readProfiles();
    console.log("📊 Total profiles disponibles:", profiles.length);
    
    if (profiles.length > 0) {
      console.log("📝 Ejemplo del primer profile:", {
        username: profiles[0]?.username,
        firstName: profiles[0]?.firstName,
        lastName: profiles[0]?.lastName,
        hasAvatar: !!profiles[0]?.avatar
      });
    }
    
    const results = profiles
      .filter(
        (p) => {
          const matches = (p.username && p.username.toLowerCase().includes(query)) ||
                         (p.firstName && p.firstName.toLowerCase().includes(query)) ||
                         (p.lastName && p.lastName.toLowerCase().includes(query)) ||
                         (p.email && p.email.toLowerCase().includes(query));
          
          if (matches) {
            console.log("✅ Match encontrado:", p.username, p.firstName, p.lastName);
          }
          
          return matches;
        }
      )
      .map((p) => ({
        username: p.username,
        name: `${p.firstName || ""} ${p.lastName || ""}`.trim(),
        avatar: p.avatar || "/default-avatar.png",
        _id: p.userId || p.username,
        about: p.about || "",
      }))
      .slice(0, 7);

    console.log("🎯 Resultados finales:", results.length, "usuarios");
    console.log("📋 Results completos:", results);
    
    return res.json(Array.isArray(results) ? results : []);
  }

  if (type === "posts") {
    console.log("📝 Buscando posts...");
    
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

    console.log("📝 Posts encontrados:", results.length);
    return res.json(Array.isArray(results) ? results : []);
  }

  console.log("❓ Tipo no reconocido:", type);
  res.json([]);
});

export default router;