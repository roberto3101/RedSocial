import { Router } from "express";
import { verifyToken } from "../middleware/auth.js";
import {
  getProfileById,
  upsertProfile,
  getProfileByUsername
} from "../profileStore.js";

const router = Router();

/* -------- Obtener MI perfil ------------------------------- */
router.get("/", verifyToken, async (req, res) => {
  try {
    const profile = await getProfileById(req.user.id);
    // Si no hay perfil, devolver objeto vacío en lugar de 404
    res.json(profile || {});
  } catch (err) {
    console.error("/api/profile GET:", err);
    res.status(500).json({ msg: "Algo salió mal" });
  }
});

/* -------- Crear / actualizar perfil ----------------------- */
router.post("/", verifyToken, async (req, res) => {
  try {
    await upsertProfile({ userId: req.user.id, ...req.body });
    const updated = await getProfileById(req.user.id);
    res.status(200).json(updated);
  } catch (err) {
    console.error("/api/profile POST:", err);
    res.status(500).json({ msg: "Algo salió mal" });
  }
});

/* -------- Obtener perfil por username (público) ----------- */
router.get("/:username", async (req, res) => {
  try {
    const profile = await getProfileByUsername(req.params.username);
    if (!profile) {
      return res.status(404).json({ msg: "Perfil no encontrado" });
    }
    res.json(profile);
  } catch (err) {
    console.error("/api/profile/:username GET:", err);
    res.status(500).json({ msg: "Error del servidor" });
  }
});

export default router;

//backend\routes\profile.js