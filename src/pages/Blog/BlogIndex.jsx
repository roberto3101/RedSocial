import { Link } from "react-router-dom";
import PostCard from "../../components/PostCard";
import { useEffect, useState } from "react";
import { getPosts } from "../../lib/posts";
import EditPostModal from "../../components/EditPostModal";

export default function BlogIndex() {
  const [posts, setPosts] = useState([]);
  const [postToEdit, setPostToEdit] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchPosts = () => {
    getPosts().then((data) => {
      const seen = new Set();
      const filtered = data.filter((post) => {
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

  const deletePost = async (slug) => {
    if (!confirm("¿Estás seguro de eliminar este artículo?")) return;

    try {
      const res = await fetch(`http://localhost:3001/api/posts/${slug}`, {
        method: "DELETE"
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
      const res = await fetch(`http://localhost:3001/api/posts/${post.slug}`);
      if (!res.ok) throw new Error("No se pudo obtener el artículo");
      const data = await res.json();
      setPostToEdit(data);
      setModalOpen(true);
    } catch (err) {
      console.error(err);
      alert("❌ Error al abrir el editor.");
    }
  };

  const isAdmin = true;

  return (
    <section className="posts-preview">
      <div className="container">
        <Link to="/" className="btn-outline">← Volver</Link>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2>Blog</h2>
          {isAdmin && (
            <Link to="/blog/nuevo" className="btn-primary">+ Nuevo artículo</Link>
          )}
        </div>

        <div className="posts-grid">
          {posts.map((p, index) => (
            <div key={`${p.slug}-${index}`} className="post-card">
              <PostCard {...p} />
              {isAdmin && (
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
