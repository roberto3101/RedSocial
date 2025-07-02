// src/components/PostCard.jsx
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { useProfile } from "../context/ProfileContext";

export default function PostCard({ slug, title, excerpt, date, minutes, isOwner, onEdit, onDelete, likes: initialLikes = [], comments: initialComments = [] }) {
  const [likes, setLikes] = useState(initialLikes);
  const [userLiked, setUserLiked] = useState(false);
  const [commentsCount, setCommentsCount] = useState(initialComments.length);
  const { profile } = useProfile();

  useEffect(() => {
    if (profile && profile.username) {
      setUserLiked(likes.includes(profile.username));
    }
  }, [likes, profile]);

  const handleLike = async (e) => {
    e.preventDefault();
    
    if (!profile || !profile.username) {
      alert("Debes iniciar sesión para dar like");
      return;
    }

    try {
      const token = localStorage.getItem("jwt");
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/posts/${slug}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setLikes(data.likes);
      setUserLiked(data.userLiked);
    } catch (err) {
      console.error("Error al dar like:", err);
    }
  };

  const prettyDate = new Date(date).toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <div className="post-card">
      <Link to={`/blog/${slug}`}>
        <h3>{title}</h3>
        <p>{excerpt}</p>
        <span>{minutes} min • {prettyDate}</span>
      </Link>
      
      <div className="post-interactions">
        <button 
          className={`like-btn ${userLiked ? 'liked' : ''}`}
          onClick={handleLike}
          title={userLiked ? "Quitar like" : "Dar like"}
        >
          <span className="like-icon">{userLiked ? '❤️' : '🤍'}</span>
          <span className="like-count">{likes.length}</span>
        </button>
        
        <Link to={`/blog/${slug}`} className="comments-link">
          <span className="comment-icon">💬</span>
          <span className="comment-count">{commentsCount}</span>
        </Link>
      </div>

      {isOwner && (
        <div className="btn-group">
          <button
            className="btn-outline"
            onClick={(e) => {
              e.preventDefault();
              onEdit();
            }}
          >
            ✏️ Editar
          </button>
          <button
            className="btn-delete"
            onClick={(e) => {
              e.preventDefault();
              onDelete(slug);
            }}
          >
            🗑️ Eliminar
          </button>
        </div>
      )}
    </div>
  );
}
// src/components/PostCard.jsx
// Asegúrate de que el CSS esté importado en tu archivo principal o en el componente