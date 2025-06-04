import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RichTextEditor } from "@mantine/rte";
import DOMPurify from "dompurify";

export default function PostForm() {
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    body: "",
    date: new Date().toISOString().slice(0, 10),
    slug: "",
  });

  const navigate = useNavigate();

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
      "Header 1": "Encabezado 1",
      "Header 2": "Encabezado 2",
      "Header 3": "Encabezado 3",
      "Header 4": "Encabezado 4",
      "Align left": "Alinear a la izquierda",
      "Align center": "Alinear al centro",
      "Align right": "Alinear a la derecha",
      "Subscript": "Subíndice",
      "Superscript": "Superíndice"
    };

    const interval = setInterval(() => {
      const buttons = document.querySelectorAll(".my-rich-editor button, .my-rich-editor span");
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Verificar si ya existe un artículo con ese slug
      const resSlug = await fetch("http://localhost:3001/api/posts");
      const posts = await resSlug.json();
      const slugExists = posts.some((p) => p.slug === formData.slug);

      if (slugExists) {
        alert("❌ Ya existe un artículo con este slug. Por favor elige otro.");
        return;
      }

      // Si es único, guardar
      const res = await fetch("http://localhost:3001/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Error al guardar el artículo");
      alert("✅ Artículo guardado correctamente");
      navigate("/blog");

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
            <RichTextEditor
              value={formData.body}
              onChange={(value) => setFormData({ ...formData, body: value })}
              sticky={false}
              className="my-rich-editor"
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
          className="preview-body"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(formData.body) }}
        />
      </section>
    </>
  );
}
// src/pages/Blog/PostForm.jsx
// Aquí definimos el formulario para crear o editar un artículo del blog        