// src/context/SocketContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { API_BASE } from "../lib/apiBase";

const SocketContext = createContext();

export function useSocket() {
  return useContext(SocketContext);
}

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const [newMsg, setNewMsg] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const s = io(API_BASE.replace(/^http/, "ws"), {
      auth: { token },
      transports: ["websocket"],
    });
    setSocket(s);

    s.on("connect", () => {
      console.log("✅ Conectado a WebSocket");
    });

    s.on("new_message", (msg) => {
      setNewMsg(msg);
    });

    return () => {
      s.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, newMsg, setNewMsg }}>
      {children}
    </SocketContext.Provider>
  );
}
// src/context/SocketContext.jsx