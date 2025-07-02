import { Link, useNavigate, useLocation } from "react-router-dom";
import PostCard from "../../components/PostCard";
import { useEffect, useState } from "react";
import { getPosts } from "../../lib/posts";
import EditPostModal from "../../components/EditPostModal";
import { useProfile } from "../../context/ProfileContext";
import { API_BASE, authHeader } from "../../lib/apiBase";

// <---- AQUÍ DEFINES EL USERNAME DEL OWNER (ajústalo a tu caso)
const OWNER_USERNAME = "rocos2";

export default function BlogIndex() {
  const [posts, setPosts] = useState([]);
  const [postToEdit, setPostToEdit] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { profile } = useProfile();

  const navigate = useNavigate();
  const location = useLocation();

  const fetchPosts = () => {
    getPosts().then((data) => {
      const seen = new Set();
      const filtered = data.filter((post) => {
        if (post.author !== OWNER_USERNAME) return false;
        if (seen.has(post.slug)) return false;
        seen.add(post.slug);
        return true;
      });
      setPosts(filtered);
    }).catch(console.error);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const isOwner = (post) => profile?.username === OWNER_USERNAME && post.author === OWNER_USERNAME;

  const deletePost = async (slug) => {
    if (!confirm("¿Estás seguro de eliminar este artículo?")) return;
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
    } else if (profile?.username) {
      navigate(`/profile/${profile.username}`, { replace: true });
    } else {
      navigate("/", { replace: true });
    }
  }

  return (
    <section className="posts-preview">
      <div className="container">
        <a
          href={profile?.username ? `/profile/${profile.username}` : "/"}
          className="btn-outline"
          onClick={handleBack}
        >
          ← Volver
        </a>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2>Blog</h2>
          {profile?.username === OWNER_USERNAME && (
            <Link to="/blog/nuevo" className="btn-primary">+ Nuevo artículo</Link>
          )}
        </div>
        <div className="posts-grid">
          {posts.length === 0 && (
            <p style={{ opacity: 0.6, marginTop: "2em" }}>
              Aún no se han publicado artículos en el blog principal.
            </p>
          )}
          {posts.map((p, index) => (
            <div key={`${p.slug}-${index}`} className="post-card">
              <PostCard
                {...p}
                isOwner={isOwner(p)}
                onEdit={() => openEditModal(p)}
                onDelete={deletePost}
              />
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