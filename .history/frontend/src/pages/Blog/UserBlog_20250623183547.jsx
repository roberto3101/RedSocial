import { Link, useNavigate, useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import EditPostModal from "../../components/EditPostModal";
import { useProfile } from "../../context/ProfileContext";
import { API_BASE, authHeader } from "../../lib/apiBase";

export default function UserBlog() {
  const { username } = useParams();
  const { profile } = useProfile();
  const [posts, setPosts] = useState([]);
  const [postToEdit, setPostToEdit] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const isOwner = profile?.username === username;

  const fetchPosts = () => {
    fetch(`${API_BASE}/api/posts/user/${username}`)
      .then((res) => res.json())
      .then(setPosts)
      .catch(console.error);
  };

  useEffect(() => {
    fetchPosts();
  }, [username]);

  const deletePost = async (slug) => {
    if (!window.confirm("¿Estás seguro de eliminar este artículo?")) return;

    try {
      const res = await fetch(`${API_BASE}/api/posts/${slug}`, {
        method: "DELETE",
        headers: {
          ...authHeader(),
        },
      });
      if (!res.ok) throw new Error("Error al eliminar");
      alert("✅ Artículo eliminado");
      fetchPosts();
    } catch (err) {
      console.error(err);
      alert("❌ No se pudo eliminar.");
    }
  };

  const openEditModal = async (post) => {
    try {
      const res = await fetch(`${API_BASE}/api/posts/${post.slug}`);
      if (!res.ok) throw new Error("No se pudo obtener el artículo");
      const data = await res.json();
      setPostToEdit(data);
      setModalOpen(true);
    } catch (err) {
      console.error(err);
      alert("❌ Error al abrir el editor.");
    }
  };

  function handleBack(e) {
    e.preventDefault();
    if (location.key !== "default") {
      navigate(-1);
    } else if (username) {
      navigate(`/profile/${username}`, { replace: true });
    } else {
      navigate("/", { replace: true });
    }
  }

  return (
    <section className="posts-preview">
      <div className="container">
        <a
          href={username ? `/profile/${username}` : "/"}
          className="btn-outline"
          onClick={handleBack}
        >
          ← Volver
        </a>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2>Blog de {username}</h2>
          {isOwner && (
            <Link to="/blog/nuevo" className="btn-primary">+ Nuevo artículo</Link>
          )}
        </div>
        <div className="posts-grid">
          {posts.length === 0 && (
            <p style={{ opacity: 0.6, marginTop: "2em" }}>
              {isOwner
                ? "Aún no has publicado ningún artículo. ¡Comienza creando uno!"
                : "Este usuario aún no ha publicado ningún artículo."}
            </p>
          )}
          {posts.map((p, index) => (
            <div key={`${p.slug}-${index}`} className="post-card">
              <Link to={`/blog/${p.slug}`}>
                <h3>{p.title}</h3>
                <p>{p.excerpt}</p>
                <span>{p.date}</span>
              </Link>
              {isOwner && (
                <div className="btn-group">
                  <button onClick={() => openEditModal(p)} className="btn-outline">🦖 Editar</button>
                  <button onClick={() => deletePost(p.slug)} className="btn-delete">🗑️ Eliminar</button>
                </div>
              )}
            </div>
          ))}
        </div>
        {modalOpen && postToEdit && (
          <EditPostModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            post={postToEdit}
            onSave={fetchPosts}
          />
        )}
      </div>
    </section>
  );
}