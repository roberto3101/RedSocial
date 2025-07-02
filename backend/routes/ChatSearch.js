import { Router } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { verifyToken } from "../middleware/auth.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const profilesPath = path.resolve(__dirname, "../data/profiles.json");

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

// Solo accesible para usuarios autenticados
router.get("/", verifyToken, (req, res) => {
  const { q = "" } = req.query;
  const query = q.toLowerCase().trim();

  if (!query) return res.json([]);

  const profiles = readProfiles();
  const results = profiles
    .filter(
      (p) =>
        (p.username && p.username.toLowerCase().includes(query)) ||
        (p.firstName && p.firstName.toLowerCase().includes(query)) ||
        (p.lastName && p.lastName.toLowerCase().includes(query))
    )
    .map((p) => ({
      username: p.username,
      name: `${p.firstName || ""} ${p.lastName || ""}`.trim(),
      avatar: p.avatar || "/default-avatar.png",
      _id: p.userId || p.username,
      about: p.about || "",
    }))
    .slice(0, 7);

  res.json(Array.isArray(results) ? results : []);
});

export default router;
// backend/routes/ChatSearch.js