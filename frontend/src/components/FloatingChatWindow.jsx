// src/components/FloatingChatWindow.jsx
import { useEffect, useRef, useState, useCallback } from "react";
import { X, Phone, Video, Check, Loader } from "lucide-react";
import { useProfile } from "../context/ProfileContext";
import { API_BASE, authHeader } from "../lib/apiBase";
import { useSocket } from "../context/SocketContext";

export default function FloatingChatWindow({ user, onClose }) {
  const { profile } = useProfile();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const messagesEndRef = useRef(null);

  const { socket } = useSocket();

  // Solo agrega mensajes del chat activo
  const handleNewMessage = useCallback(
    ({ from, message }) => {
      if (
        (from === user.username && message.to === profile?.username) ||
        (from === profile?.username && message.to === user.username)
      ) {
        setMessages((prev) => [...prev, { ...message, from }]);
        console.log("Mensaje recibido en tiempo real:", { ...message, from });
      }
    },
    [user, profile]
  );

  useEffect(() => {
    if (!socket) return;
    socket.on("private-message", handleNewMessage);
    return () => {
      socket.off("private-message", handleNewMessage);
    };
  }, [socket, handleNewMessage]);

  // Carga historial del chat al abrir ventana
  useEffect(() => {
    if (!user) return;
    const fetchChat = async () => {
      setLoading(true);
      const res = await fetch(
        `${API_BASE}/api/chats/${user.username}`,
        { headers: { ...authHeader() } }
      );
      const data = await res.json();
      setMessages(data.messages || []);
      setLoading(false);
    };
    fetchChat();
  }, [user]);

  // Scroll automático al final
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Solo REST; no socket.emit aquí
  const sendMessageHandler = async (e) => {
    e.preventDefault();
    if (!msg.trim()) return;
    await fetch(
      `${API_BASE}/api/chats/${user.username}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeader()
        },
        body: JSON.stringify({ text: msg }),
      }
    );
    setMsg(""); // El mensaje llega en tiempo real por socket
  };

  if (!profile) return null;

  return (
    <div className="floating-chat-window mmorpg-glow">
      <div className="chat-header">
        <img src={user.avatar} alt="" className="chat-avatar" />
        <div className="chat-userinfo">
          <span className="chat-username">@{user.username}</span>
          <span className="chat-fullname">{user.name}</span>
        </div>
        <button className="chat-header-btn" title="Llamada de voz" onClick={() => alert("Pronto!")}>
          <Phone size={18} />
        </button>
        <button className="chat-header-btn" title="Videollamada" onClick={() => alert("Pronto!")}>
          <Video size={18} />
        </button>
        <button className="chat-header-btn" title="Cerrar" onClick={onClose}>
          <X size={18} />
        </button>
      </div>
      <div className="chat-messages">
        {loading && <Loader className="spin" />}
        {!loading && messages.length === 0 && (
          <div className="chat-empty">¡Comienza la aventura! Este chat está vacío.</div>
        )}
        {!loading &&
          messages.map((m, i) => (
            <div
              key={i}
              className={`chat-msg-bubble ${m.from === profile?.username ? "me" : "other"}`}
            >
              <img src={m.fromAvatar} className="msg-avatar" alt="" />
              <div>
                <div className="msg-text">{m.text}</div>
                <div className="msg-meta">
                  <span>
                    {new Date(m.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </span>
                  <Check
                    size={12}
                    style={{ marginLeft: 6, opacity: 0.7 }}
                    title="Leído (mock)"
                  />
                </div>
              </div>
            </div>
          ))}
        <div ref={messagesEndRef}></div>
      </div>
      <form className="chat-input-bar" onSubmit={sendMessageHandler}>
        <input
          type="text"
          placeholder="Escribe un mensaje mágico..."
          value={msg}
          onChange={e => setMsg(e.target.value)}
          autoFocus
        />
        <button type="submit" disabled={!msg.trim()}>
          Enviar
        </button>
      </form>
    </div>
  );
}