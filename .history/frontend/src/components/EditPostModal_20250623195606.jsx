import { useEffect, useState, useRef } from "react";
import Modal from "react-modal";
import ReactQuill from "react-quill";
import { API_BASE, authHeader } from "../lib/apiBase";
import "react-quill/dist/quill.snow.css";
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

  const quillRef = useRef(null);

  useEffect(() => {
    if (post) setFormData(post);
  }, [post]);

  // Traducción de tooltips
  useEffect(() => {
    const traducciones = {
      "Bold": "Negrita",
      "Italic": "Cursiva",
      "Underline": "Subrayado",
      "Strike": "Tachado",
      "Blockquote": "Cita",
      "Code Block": "Bloque de código",
      "Link": "Insertar enlace",
      "Image": "Insertar imagen",
      "Video": "Insertar video",
      "Clean": "Quitar formato",
      "Ordered": "Lista numerada",
      "Bullet": "Lista con viñetas",
      "Header": "Encabezado",
      "Align": "Alinear",
      "Subscript": "Subíndice",
      "Superscript": "Superíndice"
    };
    const interval = setInterval(() => {
      const buttons = document.querySelectorAll(".ql-toolbar button, .ql-toolbar span");
      buttons.forEach((btn) => {
        const tooltip = btn.getAttribute("title");
        if (tooltip && traducciones[tooltip]) {
          btn.setAttribute("title", traducciones[tooltip]);
        }
      });
    }, 600);
    return () => clearInterval(interval);
  }, []);

  if (!post) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleQuillChange = (value) => {
    setFormData({ ...formData, body: value });
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
        <ReactQuill
          ref={quillRef}
          theme="snow"
          value={formData.body}
          onChange={handleQuillChange}
          className="my-rich-editor"
          placeholder="Edita el contenido aquí..."
          modules={{
            toolbar: [
              [{ 'header': [1, 2, 3, false] }],
              ['bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block'],
              [{ 'list': 'ordered'}, { 'list': 'bullet' }],
              [{ 'align': [] }],
              ['link', 'image', 'video'],
              ['clean']
            ]
          }}
        />
        <div className="btn-group">
          <button type="submit" className="btn-primary">💾 Guardar cambios</button>
          <button type="button" className="btn-outline" onClick={onClose}>Cancelar</button>
        </div>
      </form>
    </Modal>
  );
}
