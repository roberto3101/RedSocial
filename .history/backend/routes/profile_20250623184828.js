import { Router } from "express";
import { verifyToken } from "../middleware/auth.js";
import {
  getProfileById,
  upsertProfile,
  getProfileByUsername,
} from "../profileStore.js";

const router = Router();

/* --------------------------------------------------------
   Obtener MI perfil (privado)
-------------------------------------------------------- */
router.get("/", verifyToken, async (req, res) => {
  try {
    const profile = await getProfileById(req.user.id);
    // Si no hay perfil, devolver objeto vacío (200) en vez de 404
    res.json(profile || {});
  } catch (err) {
    console.error("/api/profile GET:", err);
    res.status(500).json({ msg: "Algo salió mal" });
  }
});

/* --------------------------------------------------------
   Crear / actualizar perfil (privado)
-------------------------------------------------------- */
router.post("/", verifyToken, async (req, res) => {
  try {
    const { username } = req.body;

    // 1️⃣  Verificar que el username sea único (si se envía)
    if (username) {
      const existing = await getProfileByUsername(username);
      if (existing && existing.userId !== req.user.id) {
        return res.status(409).json({ msg: "Ese nombre de usuario ya está en uso" });
      }
    }

    // 2️⃣  Crear o actualizar el perfil
    await upsertProfile({ userId: req.user.id, ...req.body });
    const updated = await getProfileById(req.user.id);
    res.status(200).json(updated);
  } catch (err) {
    console.error("/api/profile POST:", err);
    res.status(500).json({ msg: "Algo salió mal" });
  }
});

/* --------------------------------------------------------
   Obtener perfil por username (público)
-------------------------------------------------------- */
router.get("/:username", async (req, res) => {
  try {
    const profile = await getProfileByUsername(req.params.username);
    if (!profile) {
      return res.status(404).json({ msg: "Perfil no encontrado" });
    }

    // Campos seguros a exponer públicamente
    const publicProfile = {
      username:  profile.username,
      avatar:    profile.avatar,
      about:     profile.about,
      firstName: profile.firstName,
      lastName:  profile.lastName,
      // Enlaces de contacto
      whatsapp:  profile.whatsapp,
      github:    profile.github,
      linkedin:  profile.linkedin,
    };

    res.json(publicProfile);
  } catch (err) {
    console.error("/api/profile/:username GET:", err);
    res.status(500).json({ msg: "Error del servidor" });
  }
});

export default router;