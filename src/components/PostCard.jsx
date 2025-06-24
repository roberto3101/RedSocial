// src/components/PostCard.jsx
import { Link } from "react-router-dom";

export default function PostCard({ slug, title, excerpt, date, minutes, isOwner, onEdit, onDelete }) {
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