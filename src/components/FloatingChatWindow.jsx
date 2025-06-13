import { useEffect, useRef, useState } from "react";
import { X, Phone, Video, Check, Loader } from "lucide-react";
import { useProfile } from "../context/ProfileContext";

export default function FloatingChatWindow({ user, onClose }) {
  const { profile } = useProfile();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const messagesEndRef = useRef(null);

  // Si el usuario ya no está logueado, desmonta la ventana
  if (!profile) return null;

  useEffect(() => {
    if (!user) return;
    const fetchChat = async () => {
      setLoading(true);
      const token = localStorage.getItem("jwt");
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/chats/${user.username}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      setMessages(data.messages || []);
      setLoading(false);
      // Aquí conectar websocket para mensajes en tiempo real
    };
    fetchChat();
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!msg.trim()) return;
    const token = localStorage.getItem("jwt");
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/chats/${user.username}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: msg }),
      }
    );
    const data = await res.json();
    setMessages((m) => [...m, data.message]);
    setMsg("");
  };

  const startVoiceCall = () => alert("Funcionalidad de llamada de voz próximamente (WebRTC)");
  const startVideoCall = () => alert("Funcionalidad de videollamada próximamente (WebRTC)");

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
                  <span>{new Date(m.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                  {/* Aquí insertamos un icono de leído */}
                  <Check size={12} style={{ marginLeft: 6, opacity: 0.7 }} title="Leído (mock)" />
                </div>
              </div>
            </div>
          ))}
        <div ref={messagesEndRef}></div>
      </div>
      <form className="chat-input-bar" onSubmit={sendMessage}>
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
