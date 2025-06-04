// ─── backend/routes/profile.js ───────────────────────────────
import { Router } from "express";
import { verifyToken } from "../middleware/auth.js";
import { getProfileById, upsertProfile } from "../profileStore.js";

const router = Router();

/* -------- Obtener MI perfil ------------------------------- */
router.get("/", verifyToken, async (req, res) => {
  try {
    const profile = await getProfileById(req.user.id);
    res.json(profile || {});            // {} si aún no existe
  } catch (err) {
    console.error("/api/profile GET:", err);
    res.status(500).json({ msg: "Algo salió mal" });
  }
});

/* -------- Crear / actualizar perfil ----------------------- */
router.post("/", verifyToken, async (req, res) => {
  try {
    await upsertProfile({ userId: req.user.id, ...req.body });
    res.status(204).end();              // sin contenido: ok
  } catch (err) {
    console.error("/api/profile POST:", err);
    res.status(500).json({ msg: "Algo salió mal" });
  }
});

export default router;
