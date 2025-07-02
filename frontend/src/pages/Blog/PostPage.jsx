import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPostBySlug } from "../../lib/posts";
import axios from "axios";
import { useProfile } from "../../context/ProfileContext";
import CommentSection from "../../components/CommentSection";
import "../../index.css";

export default function PostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState(false);
  const [likes, setLikes] = useState([]);
  const [userLiked, setUserLiked] = useState(false);
  const { profile } = useProfile();

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    getPostBySlug(slug)
      .then(data => {
        setPost(data);
        setLikes(data.likes || []);
        if (profile && profile.username) {
          setUserLiked((data.likes || []).includes(profile.username));
        }
      })
      .catch((err) => {
        console.error(err);
        setError(true);
      });
  }, [slug, profile]);

  const handleLike = async () => {
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

  if (error) return <p className="container">Artículo no encontrado.</p>;
  if (!post) return <p className="container">Cargando artículo...</p>;

  const prettyDate = new Date(post.date).toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  let backUrl = "/blog";
  if (post?.username) backUrl = `/blog/user/${post.username}`;
  if (post?.author?.username) backUrl = `/blog/user/${post.author.username}`;
  if (post?.author && typeof post.author === 'string') backUrl = `/blog/user/${post.author}`;

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
          <div className="article-interactions">
            <button 
              className={`like-btn ${userLiked ? 'liked' : ''}`}
              onClick={handleLike}
            >
              <span className="like-icon">{userLiked ? '❤️' : '🤍'}</span>
              <span className="like-count">{likes.length}</span>
            </button>
          </div>
        </div>
      </div>

      <hr className="divider" />

      <div
        className="article-content post-body"
        dangerouslySetInnerHTML={{ __html: post.html ?? post.body }}
      />

      <hr className="divider" />

      <CommentSection 
        postSlug={slug} 
        initialComments={post.comments || []}
      />
    </article>
  );
}