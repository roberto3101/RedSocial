import { useState } from "react";
import axios from "axios";
import { useProfile } from "../context/ProfileContext";

export default function CommentSection({ postSlug, initialComments = [] }) {
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { profile } = useProfile();

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    
    if (!profile || !profile.username) {
      alert("Debes iniciar sesión para comentar");
      return;
    }

    if (!newComment.trim()) {
      alert("El comentario no puede estar vacío");
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("jwt");
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/posts/${postSlug}/comment`,
        { content: newComment },
        { headers:{ Authorization: `Bearer ${token}` }
      );
      
      setComments([...comments, data.comment]);
      setNewComment("");
    } catch (err) {
      console.error("Error al comentar:", err);
      alert(err.response?.data?.message || "Error al enviar comentario");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!confirm("¿Estás seguro de eliminar este comentario?")) return;

    try {
      const token = localStorage.getItem("jwt");
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/posts/${postSlug}/comment/${commentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setComments(comments.filter(c => c.id !== commentId));
    } catch (err) {
      console.error("Error al eliminar comentario:", err);
      alert("No se pudo eliminar el comentario");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-PE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="comment-section">
      <h3>Comentarios ({comments.length})</h3>
      
      {profile && profile.username ? (
        <form onSubmit={handleSubmitComment} className="comment-form">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Escribe un comentario..."
            rows="3"
            disabled={isSubmitting}
          />
          <button 
            type="submit" 
            className="btn-primary"
            disabled={isSubmitting || !newComment.trim()}
          >
            {isSubmitting ? "Enviando..." : "Comentar"}
          </button>
        </form>
      ) : (
        <p className="login-prompt">
          <a href="/login">Inicia sesión</a> para comentar
        </p>
      )}

      <div className="comments-list">
        {comments.length === 0 ? (
          <p className="no-comments">No hay comentarios aún. ¡Sé el primero!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="comment">
              <div className="comment-header">
                <a href={`/profile/${comment.author}`} className="comment-author">
                  @{comment.author}
                </a>
                <span className="comment-date">{formatDate(comment.date)}</span>
              </div>
              <p className="comment-content">{comment.content}</p>
              {profile && profile.username === comment.author && (
                <button 
                  className="delete-comment-btn"
                  onClick={() => handleDeleteComment(comment.id)}
                  title="Eliminar comentario"
                >
                  🗑️
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}