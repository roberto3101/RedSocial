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
    if (e.target.classList.contains("follow-modal-backdrop")) {
      onClose();
    }
  };

  const title = type === "followers" ? "Seguidores" : "Siguiendo";

  return (
    <div className="follow-modal-backdrop" onClick={handleBackdropClick}>
      <div className="follow-modal-container">
        <div className="follow-modal-header">
          <h3 className="follow-modal-title">{title}</h3>
          <button className="follow-modal-close-btn" onClick={onClose}>✕</button>
        </div>
        
        <div className="follow-modal-content">
          {loading ? (
            <div className="follow-modal-loading">Cargando...</div>
          ) : users.length === 0 ? (
            <div className="follow-modal-empty">
              {type === "followers" 
                ? "Aún no hay seguidores" 
                : "Aún no sigue a nadie"}
            </div>
          ) : (
            <div className="follow-modal-users-list">
              {users.map(user => (
                <Link 
                  key={user.username} 
                  to={`/profile/${user.username}`}
                  className="follow-modal-user-item"
                  onClick={onClose}
                >
                  <img 
                    src={user.avatar || "/default-avatar.png"} 
                    alt={user.username}
                    className="follow-modal-user-avatar"
                  />
                  <div className="follow-modal-user-info">
                    <div className="follow-modal-user-username">@{user.username}</div>
                    <div className="follow-modal-user-fullname">
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