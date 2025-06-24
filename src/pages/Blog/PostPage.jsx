// src/pages/Blog/PostPage.jsx
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPostBySlug } from "../../lib/posts";
import "../../index.css";

export default function PostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

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

  // Determinar ruta para volver
  let backUrl = "/blog";
  if (post?.username) backUrl = `/blog/user/${post.username}`;
  if (post?.author?.username) backUrl = `/blog/user/${post.author.username}`;

  function handleBack(e) {
    e.preventDefault();
    if (location.key !== "default") {
      navigate(-1);
    } else {
      navigate(backUrl, { replace: true });
    }
  }

  return (
    <article className="article-page">
      <div className="article-header">
        <a href={backUrl} className="btn-outline" onClick={handleBack}>
          ← Volver
        </a>
        <h1 className="article-title">{post.title}</h1>
        <div className="article-meta">
          <span>{prettyDate}</span> • <span>{post.minutes ?? "?"} min de lectura</span>
        </div>
      </div>

      <hr className="divider" />

      <div
        className="article-content post-body"
        dangerouslySetInnerHTML={{ __html: post.html ?? post.body }}
      />
    </article>
  );
}