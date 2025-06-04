// ─────────────────────────────────────────────────────────────
//  Middleware: verifica el JWT que llega en el header
//  Authorization: Bearer <token>
//  Si es válido añade  req.user   →  { id, email }
// ─────────────────────────────────────────────────────────────
import jwt from "jsonwebtoken";
import { findByEmail } from "../userStore.js";

/**  verifyToken(req,res,next)  */
export async function verifyToken(req, res, next) {
  try {
    /* 1) Leer header */
    const authHeader = req.headers.authorization || "";      // "Bearer xxx"
    const [, token]  = authHeader.split(" ");

    if (!token) return res.status(401).json({ msg: "No autorizado" });

    /* 2) Decodificar y validar */
    const { id } = jwt.verify(token, process.env.JWT_SECRET);

    /* 3) (opcional) obtener más datos del usuario */
    const user = await findByEmail(id);
    if (!user) return res.status(401).json({ msg: "Token inválido" });

    /* 4) Guardar en la request y continuar */
    req.user = { id: user.id, email: user.email };
    next();
  } catch (err) {
    console.error("verifyToken:", err.message);
    return res.status(401).json({ msg: "Sesión expirada o inválida" });
  }
}
