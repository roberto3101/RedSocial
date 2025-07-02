import { Router } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { verifyToken } from "../middleware/auth.js";
import { getProfileByUsername } from "../profileStore.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const chatsPath = path.resolve(__dirname, "../data/chats.json");

// Helper: lee y guarda los chats
function readChats() {
  try {
    if (!fs.existsSync(chatsPath)) return [];
    const raw = fs.readFileSync(chatsPath, "utf8");
    const chats = JSON.parse(raw);
    return Array.isArray(chats) ? chats : [];
  } catch {
    return [];
  }
}
function writeChats(chats) {
  fs.writeFileSync(chatsPath, JSON.stringify(chats, null, 2));
}

const router = Router();

/**
 * GET /api/chats
 * Lista todos los chats del usuario autenticado, incluyendo chats consigo mismo.
 */
router.get("/", verifyToken, async (req, res) => {
  try {
    const myUser = req.user.username;
    if (!myUser) return res.status(401).json({ msg: "No autenticado" });

    // Incluye los chats donde users = [myUser] (conmigo mismo)
    const chats = readChats().filter(c => c.users.includes(myUser));
    const results = await Promise.all(
      chats.map(async (c) => {
        // Si es chat contigo mismo:
        const otherUser = c.users.find(u => u !== myUser) || myUser;
        const otherProfile = await getProfileByUsername(otherUser);
        const lastMsg = c.messages[c.messages.length - 1] || null;

        return {
          username: otherProfile?.username || otherUser,
          name: `${otherProfile?.firstName || ""} ${otherProfile?.lastName || ""}`.trim(),
          avatar: otherProfile?.avatar || "/default-avatar.png",
          about: otherProfile?.about || "",
          lastMsg: lastMsg
            ? {
                from: lastMsg.from,
                text: lastMsg.text,
                timestamp: lastMsg.timestamp
              }
            : null,
        };
      })
    );
    res.json(results);
  } catch (err) {
    console.error("GET /api/chats", err);
    res.status(500).json({ msg: "Error del servidor" });
  }
});

/**
 * GET /api/chats/:username
 * Devuelve SOLO los mensajes entre el usuario autenticado y :username (incluso si eres tú mismo)
 */
router.get("/:username", verifyToken, async (req, res) => {
  try {
    const { username: otherUser } = req.params;
    const myUser = req.user.username;

    if (!myUser || !otherUser) // Permitimos myUser === otherUser
      return res.status(400).json({ msg: "Usuario inválido" });

    // Verifica que el usuario existe
    const otherProfile = await getProfileByUsername(otherUser);
    if (!otherProfile)
      return res.status(404).json({ msg: "Usuario no encontrado" });

    const chats = readChats();
    // Si es chat contigo mismo, busca users=[myUser]
    const chat = (myUser === otherUser)
      ? chats.find(c => c.users.length === 1 && c.users[0] === myUser)
      : chats.find(c => c.users.includes(myUser) && c.users.includes(otherUser));

    if (!chat || !chat.users.includes(myUser)) {
      return res.json({ messages: [] });
    }

    // Devuelve mensajes, con perfil básico de cada user
    const formatMsg = async (m) => ({
      from: m.from,
      to: m.to,
      text: m.text,
      timestamp: m.timestamp,
      fromAvatar: (await getProfileByUsername(m.from))?.avatar || "/default-avatar.png",
      toAvatar: (await getProfileByUsername(m.to))?.avatar || "/default-avatar.png"
    });

    const messages = await Promise.all(chat.messages.map(formatMsg));
    res.json({ messages });
  } catch (err) {
    console.error("GET /api/chats/:username", err);
    res.status(500).json({ msg: "Error del servidor" });
  }
});

/**
 * POST /api/chats/:username
 * Envía un mensaje privado, incluso a ti mismo (modo blog de notas)
 * { text: "contenido" }
 */
router.post("/:username", verifyToken, async (req, res) => {
  try {
    const { username: otherUser } = req.params;
    const myUser = req.user.username;
    const { text } = req.body;

    if (!myUser || !otherUser || !text?.trim())
      return res.status(400).json({ msg: "Petición inválida" });

    // Verifica que el destinatario existe
    const otherProfile = await getProfileByUsername(otherUser);
    if (!otherProfile)
      return res.status(404).json({ msg: "Usuario no encontrado" });

    const chats = readChats();

    let chat;
    // Si es chat contigo mismo, busca users=[myUser]
    if (myUser === otherUser) {
      chat = chats.find(c => c.users.length === 1 && c.users[0] === myUser);
    } else {
      chat = chats.find(c => c.users.includes(myUser) && c.users.includes(otherUser));
    }

    const newMsg = {
      from: myUser,
      to: otherUser,
      text: text.trim(),
      timestamp: Date.now()
    };

    if (!chat) {
      const usersArr = (myUser === otherUser) ? [myUser] : [myUser, otherUser];
      chat = {
        users: usersArr,
        messages: [newMsg]
      };
      chats.push(chat);
    } else {
      chat.messages.push(newMsg);
    }

    writeChats(chats);

    // Responde con el mensaje recién enviado + perfil básico
    res.status(201).json({
      message: {
        ...newMsg,
        fromAvatar: (await getProfileByUsername(myUser))?.avatar || "/default-avatar.png",
        toAvatar: (await getProfileByUsername(otherUser))?.avatar || "/default-avatar.png"
      }
    });
  } catch (err) {
    console.error("POST /api/chats/:username", err);
    res.status(500).json({ msg: "Error del servidor" });
  }
});

export default router;
// backend/routes/chats.js