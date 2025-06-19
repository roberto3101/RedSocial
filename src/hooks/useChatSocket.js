// src/hooks/useChatSocket.js
import { useEffect, useRef } from "react";

// Lee la URL del socket del .env (para producción o desarrollo)
const WS_URL =
  import.meta.env.VITE_WS_URL ||
  (import.meta.env.DEV ? "ws://localhost:3001" : undefined);

export default function useChatSocket({ username, onMessage }) {
  const socketRef = useRef(null);

  useEffect(() => {
    if (!username || !WS_URL) return;

    const socket = io(WS_URL, {
      path: "/socket.io",
      transports: ["websocket"],
      withCredentials: true, // si usas cookies/jwt
      auth: { username }
    });
    socketRef.current = socket;

    // Registra el usuario en el servidor (si tu backend lo requiere)
    socket.emit("register", username);

    // Escucha mensajes entrantes
    socket.on("private-message", (data) => {
      onMessage && onMessage(data);
    });

    return () => {
      socket.disconnect();
    };
  }, [username, onMessage]);

  // Para enviar mensajes
  const sendMessage = (to, message) => {
    socketRef.current?.emit("private-message", { to, message });
  };

  return { sendMessage };
}
