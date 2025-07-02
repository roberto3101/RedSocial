import { useEffect, useState } from "react";
import { Loader } from "lucide-react";
import { API_BASE, authHeader } from "../lib/apiBase";
import { useSocket } from "../context/SocketContext";

export default function ChatNotificationsPanel({ onOpenChat }) {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const { newMsg } = useSocket();

  // Función para recargar chats
  const fetchChats = async () => {
    setLoading(true);
    const res = await fetch(`${API_BASE}/api/chats`, {
      headers: { ...authHeader() }
    });
    const data = await res.json();
    setChats(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => {
    let isMounted = true;
    fetchChats();
    return () => { isMounted = false; };
  }, []);

  // Si llega un nuevo mensaje, refresca la lista de chats
  useEffect(() => {
    if (newMsg) {
      fetchChats();
    }
    // eslint-disable-next-line
  }, [newMsg]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", color: "#a8a8ee", marginTop: 26 }}>
        <Loader className="spin" size={20} /> Cargando chats...
      </div>
    );
  }

  if (!loading && chats.length === 0) {
    return (
      <div className="mmorpg-panel-msg" style={{ color: "#aaa", textAlign: "center", marginTop: 18 }}>
        <span role="img" aria-label="scroll">📜</span>
        <br />
        <b>¡Aún no has iniciado ninguna aventura!</b>
        <br />
        Busca un usuario y comienza un nuevo chat.
      </div>
    );
  }

  return (
    <div>
      {chats.map((c) => (
        <div
          key={c.username}
          className="mmorpg-chat-notif"
          onClick={() => onOpenChat(c)}
          tabIndex={0}
          style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: "7px 9px", borderRadius: 8,
            marginBottom: 5, background: "#21213a", cursor: "pointer"
          }}
        >
          <img src={c.avatar} alt="" style={{ width: 32, height: 32, borderRadius: "50%" }} />
          <div style={{ flex: 1 }}>
            <div style={{ color: "#fff", fontWeight: 600 }}>
              @{c.username}
            </div>
            <div style={{
              color: "#b2adfa", fontSize: "0.93rem",
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"
            }}>
              {c.lastMsg?.text
                ? <>
                    <span style={{
                      color: c.lastMsg.from === c.username ? "#60e388" : "#ccc"
                    }}>
                      {c.lastMsg.from === c.username ? "→" : "←"}
                    </span>{" "}
                    {c.lastMsg.text.slice(0, 38)}
                  </>
                : <i>Sin mensajes aún</i>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}