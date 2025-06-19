// src/components/FloatingChatWindow.jsx
import { useEffect, useRef, useState, useCallback } from "react";
import { X, Phone, Video, Check, Loader } from "lucide-react";
import { useProfile } from "../context/ProfileContext";
import { API_BASE, authHeader } from "../lib/apiBase";
import { useSocket } from "../context/SocketContext"; // ← Usa el contexto global

export default function FloatingChatWindow({ user, onClose }) {
  const { profile } = useProfile();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const messagesEndRef = useRef(null);

  const { socket } = useSocket();

  // Recibe mensajes nuevos del servidor (de cualquier chat)
  const handleNewMessage = useCallback(
    ({ from, message }) => {
      if (
        // Si el mensaje es del usuario activo o para él
        (from === user.username || message.to === user.username)
      ) {
        setMessages((prev) => [...prev, { ...message, from }]);
      }
    },
    [user]
  );

  // Escucha eventos del socket
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

  // Enviar mensaje (REST + WebSocket)
  const sendMessageHandler = async (e) => {
    e.preventDefault();
    if (!msg.trim()) return;
    // Envía por REST para guardar en backend
    const res = await fetch(
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
    const data = await res.json();
    setMessages((m) => [...m, data.message]);
    setMsg("");
    // Envía por WebSocket al otro usuario
    if (socket) {
      socket.emit("private-message", {
        to: user.username,
        message: data.message
      });
    }
  };

  const startVoiceCall = () => alert("Funcionalidad de llamada de voz próximamente (WebRTC)");
  const startVideoCall = () => alert("Funcionalidad de videollamada próximamente (WebRTC)");

  if (!profile) return null;

  return (
    <div className="floating-chat-window mmorpg-glow">
      <div className="chat-header">
        <img src={user.avatar} alt="" className="chat-avatar" />
        <div className="chat-userinfo">
          <span className="chat-username">@{user.username}</span>
          <span className="chat-fullname">{user.name}</span>
        </div>
        <button className="chat-header-btn" title="Llamada de voz" onClick={startVoiceCall}>
          <Phone size={18} />
        </button>
        <button className="chat-header-btn" title="Videollamada" onClick={startVideoCall}>
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
              className={`chat-msg-bubble ${
                m.from === profile?.username ? "me" : "other"
              }`}
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
