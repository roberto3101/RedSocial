// src/pages/Blog/PostPage.jsx
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPostBySlug } from "../../lib/posts";
import "../../index.css"; // Asegúrate de importar el CSS

export default function PostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    getPostBySlug(slug)
      .then(setPost)
      .catch((err) => {
        console.error(err);
        setError(true);
      });
  }, [slug]);

  if (error) return <p className="container">Artículo no encontrado.</p>;
  if (!post) return <p className="container">Cargando artículo...</p>;

  const prettyDate = new Date(post.date).toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <article className="article-page">
      <div className="article-header">
        <Link to="/blog" className="btn-outline">← Volver</Link>
        <h1 className="article-title">{post.title}</h1>
        <div className="article-meta">
          <span>{prettyDate}</span> • <span>{post.minutes ?? "?"} min de lectura</span>
        </div>
      </div>

      <hr className="divider" />

      <div
        className="article-content"
        dangerouslySetInnerHTML={{ __html: post.html ?? post.body }}
      />
    </article>
  );
}
