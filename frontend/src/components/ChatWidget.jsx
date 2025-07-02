import { useState } from "react";
import { MessageSquare, PlusCircle } from "lucide-react";
import { useProfile } from "../context/ProfileContext";
import { useNavigate } from "react-router-dom";
import ChatNotificationsPanel from "./ChatNotificationsPanel";
import FloatingChatWindow from "./FloatingChatWindow";
import { API_BASE, authHeader } from "../lib/apiBase";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const { profile } = useProfile();
  const navigate = useNavigate();

  const [showSearch, setShowSearch] = useState(false);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeChatUser, setActiveChatUser] = useState(null);

  const handleSearch = async (e) => {
    const q = e.target.value;
    setSearch(q);

    if (!q.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const url = `${API_BASE}/api/chat-search?q=${encodeURIComponent(q)}`;
      const res = await fetch(url, {
        headers: { ...authHeader() }
      });
      if (res.ok) {
        const data = await res.json();
        setResults(Array.isArray(data) ? data : []);
      } else {
        setResults([]);
      }
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-widget-container">
      <div className="chat-widget-toggle" onClick={() => setOpen(o => !o)}>
        <MessageSquare size={22} style={{ marginRight: 8 }} />
        <span>Chats</span>
      </div>
      {activeChatUser && (
        <FloatingChatWindow
          user={activeChatUser}
          onClose={() => setActiveChatUser(null)}
        />
      )}
      {open && (
        <div className="chat-widget-panel">
          <div className="chat-widget-header">
            <span>Chats</span>
            <button
              className="chat-widget-close"
              onClick={() => {
                setOpen(false);
                setShowSearch(false);
                setSearch("");
                setResults([]);
              }}
            >
              ×
            </button>
          </div>
          <div className="chat-widget-body">
            {!profile ? (
              <div className="mmorpg-login-alert">
                <div className="mmorpg-glow">
                  <span role="img" aria-label="Espada">🗡️</span>
                  <h3>¡Acceso solo para Aventureros!</h3>
                  <p>
                    Para enviar mensajes a otros viajeros, primero debes <b>iniciar sesión</b>.<br />
                    <span style={{ color: "#90f", fontWeight: 500 }}>¡Únete al gremio y comienza tu aventura en el chat!</span>
                  </p>
                  <button
                    className="mmorpg-login-btn"
                    onClick={() => {
                      setOpen(false);
                      navigate("/login");
                    }}
                  >
                    Iniciar sesión
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div style={{ display: "flex", alignItems: "center", marginBottom: 10 }}>
                  <button
                    className="mmorpg-history-btn"
                    style={{
                      flex: 1,
                      background: !showSearch ? "#383863" : "#25254a",
                      color: "#eee",
                      border: "none",
                      borderRadius: "7px 0 0 7px",
                      padding: "8px 0",
                      cursor: "pointer"
                    }}
                    onClick={() => setShowSearch(false)}
                  >
                    <span role="img" aria-label="scroll">📜</span> Mis mensajes
                  </button>
                  <button
                    className="mmorpg-search-btn"
                    style={{
                      flex: 1,
                      background: showSearch ? "#383863" : "#25254a",
                      color: "#eee",
                      border: "none",
                      borderRadius: "0 7px 7px 0",
                      padding: "8px 0",
                      cursor: "pointer"
                    }}
                    onClick={() => setShowSearch(true)}
                  >
                    <PlusCircle size={16} style={{ marginBottom: -2, marginRight: 4 }} />
                    Nuevo chat
                  </button>
                </div>
                {!showSearch ? (
                  <ChatNotificationsPanel onOpenChat={user => {
                    setActiveChatUser(user);
                    setOpen(false);
                  }} />
                ) : (
                  <div>
                    <input
                      type="text"
                      className="chat-search-input"
                      placeholder="Buscar usuario para chatear…"
                      value={search}
                      onChange={handleSearch}
                      autoFocus
                      style={{
                        width: "100%",
                        padding: "9px 14px",
                        borderRadius: 8,
                        border: "1px solid #3e3e59",
                        background: "#232337",
                        color: "#eee",
                        marginBottom: 12,
                        fontSize: "1rem",
                      }}
                    />
                    {loading && (
                      <div style={{ color: "#a9a9ee", marginTop: 10, textAlign: "center" }}>
                        Buscando usuarios...
                      </div>
                    )}
                    {(!loading && results.length === 0 && search.trim()) && (
                      <div style={{ color: "#b4b4b4", marginTop: 10, textAlign: "center" }}>
                        Ningún usuario coincide.
                      </div>
                    )}
                    {!loading && results.length > 0 && (
                      <div className="chat-search-results">
                        {results.map((user) => (
                          <div
                            key={user.username}
                            className="chat-search-user"
                            tabIndex={0}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 11,
                              padding: "8px 8px",
                              borderRadius: 7,
                              cursor: "pointer",
                              background: "#24243d",
                              marginBottom: 6,
                              transition: "background 0.15s"
                            }}
                            onClick={() => {
                              setActiveChatUser(user);
                              setOpen(false);
                              setShowSearch(false);
                              setSearch("");
                              setResults([]);
                            }}
                          >
                            <img
                              src={user.avatar}
                              alt=""
                              style={{
                                width: 34,
                                height: 34,
                                borderRadius: "50%",
                                objectFit: "cover",
                                border: "1.5px solid #444"
                              }}
                            />
                            <div style={{ display: "flex", flexDirection: "column" }}>
                              <span style={{ color: "#fff", fontWeight: 500 }}>
                                @{user.username}
                              </span>
                              <span style={{ color: "#bbb", fontSize: "0.92rem" }}>
                                {user.name}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}