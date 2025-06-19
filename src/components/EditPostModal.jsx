import { useEffect, useState } from "react";
import Modal from "react-modal";
import { RichTextEditor } from "@mantine/rte";
import { API_BASE, authHeader } from "../lib/apiBase";
Modal.setAppElement("#root");
Modal.defaultStyles.overlay.zIndex = 100;

export default function EditPostModal({ isOpen, onClose, post, onSave }) {
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    body: "",
    date: "",
    slug: ""
  });

  useEffect(() => {
    if (post) setFormData(post);
  }, [post]);

  if (!post) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/api/posts/${post.slug}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...authHeader()
        },
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error("Error al actualizar el artículo");
      alert("✅ Artículo actualizado.");
      onSave();
      onClose();
    } catch (err) {
      console.error(err);
      alert("❌ No se pudo actualizar el artículo.");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="modal-content-modern"
      overlayClassName="modal-overlay-modern"
    >
      <h2 className="modal-title">✏️ Editar artículo</h2>
      <form onSubmit={handleSubmit} className="form-post">
        <input name="title" value={formData.title} onChange={handleChange} required />
        <input name="slug" value={formData.slug} onChange={handleChange} required />
        <input name="date" type="date" value={formData.date} onChange={handleChange} required />
        <textarea name="excerpt" value={formData.excerpt} onChange={handleChange} rows={2} required />
        <RichTextEditor
          value={formData.body}
          onChange={(value) => setFormData({ ...formData, body: value })}
          className="my-rich-editor"
        />
        <div className="btn-group">
          <button type="submit" className="btn-primary">💾 Guardar cambios</button>
          <button type="button" className="btn-outline" onClick={onClose}>Cancelar</button>
        </div>
      </form>
    </Modal>
  );
}
