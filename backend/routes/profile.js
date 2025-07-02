import { Router } from "express";
import { verifyToken } from "../middleware/auth.js";
import {
  getProfileById,
  upsertProfile,
  getProfileByUsername,
  getAllProfiles,
} from "../profileStore.js";

const router = Router();

/* --------------------------------------------------------
   Obtener MI perfil (privado)
-------------------------------------------------------- */
router.get("/", verifyToken, async (req, res) => {
  try {
    const profile = await getProfileById(req.user.id);
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

    if (username) {
      const existing = await getProfileByUsername(username);
      if (existing && existing.userId !== req.user.id) {
        return res.status(409).json({ msg: "Ese nombre de usuario ya está en uso" });
      }
    }

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

    const publicProfile = {
      username:  profile.username,
      avatar:    profile.avatar,
      about:     profile.about,
      firstName: profile.firstName,
      lastName:  profile.lastName,
      whatsapp:  profile.whatsapp,
      github:    profile.github,
      linkedin:  profile.linkedin,
      // Agregar contadores de seguidores
      followersCount: (profile.followers || []).length,
      followingCount: (profile.following || []).length,
    };

    res.json(publicProfile);
  } catch (err) {
    console.error("/api/profile/:username GET:", err);
    res.status(500).json({ msg: "Error del servidor" });
  }
});

/* --------------------------------------------------------
   Seguir a un usuario
-------------------------------------------------------- */
router.post("/:username/follow", verifyToken, async (req, res) => {
  try {
    const { username } = req.params;
    const currentUser = await getProfileById(req.user.id);
    
    if (!currentUser || !currentUser.username) {
      return res.status(400).json({ msg: "Debes completar tu perfil primero" });
    }

    if (currentUser.username === username) {
      return res.status(400).json({ msg: "No puedes seguirte a ti mismo" });
    }

    const targetUser = await getProfileByUsername(username);
    if (!targetUser) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    // Inicializar arrays si no existen
    if (!currentUser.following) currentUser.following = [];
    if (!targetUser.followers) targetUser.followers = [];

    // Verificar si ya lo sigue
    if (currentUser.following.includes(username)) {
      return res.status(400).json({ msg: "Ya sigues a este usuario" });
    }

    // Agregar a las listas
    currentUser.following.push(username);
    targetUser.followers.push(currentUser.username);

    // Guardar cambios
    await upsertProfile(currentUser);
    await upsertProfile(targetUser);

    res.json({ msg: "Ahora sigues a " + username });
  } catch (err) {
    console.error("/api/profile/:username/follow POST:", err);
    res.status(500).json({ msg: "Error al seguir usuario" });
  }
});

/* --------------------------------------------------------
   Dejar de seguir a un usuario
-------------------------------------------------------- */
router.delete("/:username/follow", verifyToken, async (req, res) => {
  try {
    const { username } = req.params;
    const currentUser = await getProfileById(req.user.id);
    
    if (!currentUser || !currentUser.username) {
      return res.status(400).json({ msg: "Debes completar tu perfil primero" });
    }

    const targetUser = await getProfileByUsername(username);
    if (!targetUser) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    // Remover de las listas
    currentUser.following = (currentUser.following || []).filter(u => u !== username);
    targetUser.followers = (targetUser.followers || []).filter(u => u !== currentUser.username);

    // Guardar cambios
    await upsertProfile(currentUser);
    await upsertProfile(targetUser);

    res.json({ msg: "Dejaste de seguir a " + username });
  } catch (err) {
    console.error("/api/profile/:username/follow DELETE:", err);
    res.status(500).json({ msg: "Error al dejar de seguir" });
  }
});

/* --------------------------------------------------------
   Verificar si sigo a un usuario
-------------------------------------------------------- */
router.get("/:username/follow-status", verifyToken, async (req, res) => {
  try {
    const { username } = req.params;
    const currentUser = await getProfileById(req.user.id);
    
    if (!currentUser || !currentUser.username) {
      return res.json({ isFollowing: false });
    }

    const isFollowing = (currentUser.following || []).includes(username);
    res.json({ isFollowing });
  } catch (err) {
    console.error("/api/profile/:username/follow-status GET:", err);
    res.status(500).json({ msg: "Error al verificar estado" });
  }
});

/* --------------------------------------------------------
   Obtener seguidores de un usuario
-------------------------------------------------------- */
router.get("/:username/followers", async (req, res) => {
  try {
    const { username } = req.params;
    const profile = await getProfileByUsername(username);
    
    if (!profile) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    const followers = profile.followers || [];
    const profiles = await getAllProfiles();
    
    const followerProfiles = followers.map(followerUsername => {
      const followerProfile = profiles.find(p => p.username === followerUsername);
      if (!followerProfile) return null;
      
      return {
        username: followerProfile.username,
        avatar: followerProfile.avatar,
        firstName: followerProfile.firstName,
        lastName: followerProfile.lastName,
      };
    }).filter(Boolean);

    res.json(followerProfiles);
  } catch (err) {
    console.error("/api/profile/:username/followers GET:", err);
    res.status(500).json({ msg: "Error al obtener seguidores" });
  }
});

/* --------------------------------------------------------
   Obtener usuarios seguidos
-------------------------------------------------------- */
router.get("/:username/following", async (req, res) => {
  try {
    const { username } = req.params;
    const profile = await getProfileByUsername(username);
    
    if (!profile) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    const following = profile.following || [];
    const profiles = await getAllProfiles();
    
    const followingProfiles = following.map(followingUsername => {
      const followingProfile = profiles.find(p => p.username === followingUsername);
      if (!followingProfile) return null;
      
      return {
        username: followingProfile.username,
        avatar: followingProfile.avatar,
        firstName: followingProfile.firstName,
        lastName: followingProfile.lastName,
      };
    }).filter(Boolean);

    res.json(followingProfiles);
  } catch (err) {
    console.error("/api/profile/:username/following GET:", err);
    res.status(500).json({ msg: "Error al obtener seguidos" });
  }
});

export default router;