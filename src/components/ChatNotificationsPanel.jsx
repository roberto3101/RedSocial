import { useEffect, useState } from "react";
import { Loader } from "lucide-react";

export default function ChatNotificationsPanel({ onOpenChat }) {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchChats = async () => {
      setLoading(true);
      const token = localStorage.getItem("jwt");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/chats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (isMounted) {
        setChats(Array.isArray(data) ? data : []);
        setLoading(false);
      }
    };
    fetchChats();
    return () => { isMounted = false; };
  }, []);

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
          {/* Aquí podrías agregar un badge de "no leído" */}
        </div>
      ))}
    </div>
  );
}
