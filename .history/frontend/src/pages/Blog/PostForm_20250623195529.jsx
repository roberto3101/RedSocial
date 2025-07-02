import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import DOMPurify from "dompurify";
import { useProfile } from "../../context/ProfileContext";
import { API_BASE, authHeader } from "../../lib/apiBase";
import "react-quill/dist/quill.snow.css";

export default function PostForm() {
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    body: "",
    date: new Date().toISOString().slice(0, 10),
    slug: "",
  });

  const quillRef = useRef(null);
  const navigate = useNavigate();
  const { profile } = useProfile();

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleQuillChange = (value) => {
    setFormData({ ...formData, body: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!profile?.username) {
      alert("Error: Debes tener un perfil con nombre de usuario para publicar.");
      return;
    }
    try {
      const resSlug = await fetch(`${API_BASE}/api/posts`);
      const posts = await resSlug.json();
      const slugExists = posts.some((p) => p.slug === formData.slug);

      if (slugExists) {
        alert("❌ Ya existe un artículo con este slug. Por favor elige otro.");
        return;
      }

      const dataToSend = { ...formData };
      const res = await fetch(`${API_BASE}/api/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeader(),
        },
        body: JSON.stringify(dataToSend),
      });

      if (!res.ok) throw new Error("Error al guardar el artículo");
      alert("✅ Artículo guardado correctamente");

      navigate(`/blog/user/${profile.username}`);
    } catch (err) {
      console.error(err);
      alert("Hubo un error al guardar el artículo.");
    }
  };

  const insertYouTubeVideo = () => {
    const url = prompt("Pega el enlace de YouTube:");
    if (!url) return;
    const match = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w\-]+)/);
    if (!match || !match[1]) {
      alert("URL inválida");
      return;
    }
    const videoId = match[1];
    const embedHtml = `
      <div style="text-align:center; margin: 1em 0;">
        <iframe width="560" height="315"
          src="https://www.youtube.com/embed/${videoId}"
          frameborder="0" allowfullscreen style="max-width:100%; border-radius: 8px;">
        </iframe>
      </div>`;
    setFormData((prev) => ({
      ...prev,
      body: prev.body + embedHtml,
    }));
  };

  return (
    <>
      <section className="form-wrapper">
        <h2 className="form-title">📝 Crear nuevo artículo</h2>
        <form onSubmit={handleSubmit} className="form-post">
          <div className="field-group">
            <label>Título</label>
            <input
              name="title"
              placeholder="Ej: Los secretos del universo"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="field-group">
            <label>Slug (URL)</label>
            <input
              name="slug"
              placeholder="Ej: secretos-universo"
              value={formData.slug}
              onChange={handleChange}
              required
            />
          </div>
          <div className="field-group">
            <label>Fecha de publicación</label>
            <input
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
          <div className="field-group">
            <label>Descripción breve</label>
            <textarea
              name="excerpt"
              placeholder="Resumen del artículo para mostrar en tarjetas"
              value={formData.excerpt}
              onChange={handleChange}
              rows={3}
              required
            />
          </div>
          <div className="field-group">
            <label>Contenido principal</label>
            <ReactQuill
              ref={quillRef}
              theme="snow"
              value={formData.body}
              onChange={handleQuillChange}
              className="my-rich-editor"
              placeholder="Escribe el contenido aquí..."
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
          </div>
          <div className="btn-group">
            <button
              type="button"
              onClick={insertYouTubeVideo}
              className="btn-insert-youtube"
            >
              🎥 Insertar video de YouTube
            </button>
            <button type="submit" className="btn-primary">
              💾 Guardar artículo
            </button>
          </div>
        </form>
      </section>
      <section className="preview-panel">
        <h3>Vista previa en tiempo real</h3>
        <div
          className="preview-body article-content post-body"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(formData.body) }}
        />
      </section>
    </>
  );
}
