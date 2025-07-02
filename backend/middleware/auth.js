// backend/middleware/auth.js
import jwt from "jsonwebtoken";
import { findById } from "../userStore.js";
import { getProfileById } from "../profileStore.js";

export async function verifyToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization || "";
    const [, token]  = authHeader.split(" ");
    if (!token) return res.status(401).json({ msg: "No autorizado" });

    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await findById(id);
    if (!user) return res.status(401).json({ msg: "Token inválido" });

    // Busca el username del perfil y añádelo a req.user
    let username = null;
    try {
      const profile = await getProfileById(user.id);
      username = profile?.username || null;
    } catch {}

    req.user = { id: user.id, email: user.email, username }; // Incluye username!
    next();
  } catch (err) {
    console.error("verifyToken:", err.message);
    return res.status(401).json({ msg: "Sesión expirada o inválida" });
  }
}