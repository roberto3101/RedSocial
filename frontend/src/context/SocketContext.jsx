import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useProfile } from "./ProfileContext"; // ← Ajusta ruta si es necesario

const SocketContext = createContext();

export function useSocket() {
  return useContext(SocketContext);
}

export function SocketProvider({ children }) {
  const { profile } = useProfile();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    const wsURL =
      import.meta.env.VITE_WS_URL ||
      (import.meta.env.DEV ? "ws://localhost:3001" : undefined);

    // Debug: Verifica cuándo y con quién se monta el contexto de socket
    console.log("🔄 [SocketContext] useEffect:", {
      token,
      wsURL,
      username: profile?.username,
    });

    // Solo conecta si está todo listo
    if (!token || !wsURL || !profile?.username) {
      setSocket(null);
      return;
    }

    // Solo crea UN socket por usuario logueado
    const s = io(wsURL, {
      auth: { token },
      transports: ["websocket"],
    });

    s.on("connect", () => {
      console.log("✅ [SocketContext] Conectado! id:", s.id, "como:", profile.username);
      s.emit("register", profile.username);
      console.log("🔗 [SocketContext] Register emitido con:", profile.username);
    });

    // Por si quieres debuggear desconexión
    s.on("disconnect", (reason) => {
      console.log("❌ [SocketContext] Desconectado de WebSocket. Motivo:", reason);
    });

    setSocket(s);

    // Limpieza real SOLO si desmonta contexto o cambia usuario
    return () => {
      console.log("🧹 [SocketContext] Desmontando/desconectando socket:", s.id);
      s.disconnect();
    };
  }, [profile?.username]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
}