import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function FollowModal({ isOpen, onClose, username, type }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen || !username) return;

    setLoading(true);
    const endpoint = type === "followers" ? "followers" : "following";
    
    axios.get(`${import.meta.env.VITE_API_URL}/api/profile/${username}/${endpoint}`)
      .then(res => {
        setUsers(res.data || []);
      })
      .catch(err => {
        console.error(`Error loading ${type}:`, err);
        setUsers([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [isOpen, username, type]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target.classList.contains("modal-backdrop")) {
      onClose();
    }
  };

  const title = type === "followers" ? "Seguidores" : "Siguiendo";

  return (
    <div className="modal-backdrop follow-modal-backdrop" onClick={handleBackdropClick}>
      <div className="follow-modal">
        <div className="follow-modal-header">
          <h3>{title}</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        
        <div className="follow-modal-content">
          {loading ? (
            <div className="loading-state">Cargando...</div>
          ) : users.length === 0 ? (
            <div className="empty-state">
              {type === "followers" 
                ? "Aún no hay seguidores" 
                : "Aún no sigue a nadie"}
            </div>
          ) : (
            <div className="users-list">
              {users.map(user => (
                <Link 
                  key={user.username} 
                  to={`/profile/${user.username}`}
                  className="user-item"
                  onClick={onClose}
                >
                  <img 
                    src={user.avatar || "/default-avatar.png"} 
                    alt={user.username}
                    className="user-avatar"
                  />
                  <div className="user-info">
                    <div className="user-username">@{user.username}</div>
                    <div className="user-name">
                      {user.firstName} {user.lastName}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}