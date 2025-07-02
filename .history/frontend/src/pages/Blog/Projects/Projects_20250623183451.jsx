import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useProfile } from "../../../context/ProfileContext";
import { API_BASE } from "../../../lib/apiBase";

// Detecta base path dinámico para GitHub Pages ("/RedSocial") o desarrollo ("/")
const BASE_PATH = window.location.pathname.startsWith("/RedSocial")
  ? "/RedSocial"
  : "";

// PROYECTOS DEMO para landing o modo demo
const demoProjects = [
  {
    id: "demo-1",
    image: `${BASE_PATH}/imagenes/BiblioSystem.jpg`,
    name: "BiblioSystem",
    brief: "Sistema de gestión de bibliotecas con login, roles y CRUD para libros y alumnos.",
    technologies: ["Java", "MySQL", "Tomcat"],
    repo: "https://github.com/roberto3101"
  },
  {
    id: "demo-2",
    image: `${BASE_PATH}/imagenes/CRUD.jpg`,
    name: "CRUD App",
    brief: "CRUD sencillo con React y MySQL.",
    technologies: ["React", "SqlServer", "Node.js"],
    repo: "https://github.com/roberto3101"
  },
  {
    id: "demo-3",
    image: `${BASE_PATH}/imagenes/Thenx.png`,
    name: "Web de ejercicios",
    brief: "Aplicación para gestionar rutinas y progreso de entrenamiento.",
    technologies: ["HTML", "CSS", "JavaScript"],
    repo: "https://github.com/roberto3101"
  },
  {
    id: "demo-4",
    image: `${BASE_PATH}/imagenes/highrise.png`,
    name: "Bots JS / Node",
    brief: "Bots en Javascript + Node.js para automatizar emotes, teleports, roles y donaciones.",
    technologies: ["JavaScript", "Node.js"],
    repo: "https://github.com/roberto3101"
  }
];

// Modal para agregar/editar proyectos
function ProjectModal({ open, onClose, onSave, initial }) {
  const [form, setForm] = useState(
    initial || {
      name: "",
      brief: "",
      technologies: [],
      repo: "",
      image: "",
      imageFile: null,
    }
  );
  const [imgPreview, setImgPreview] = useState(initial?.image || "");

  useEffect(() => {
    if (initial) {
      setForm({ ...initial, imageFile: null });
      setImgPreview(initial.image || "");
    } else {
      setForm({ name: "", brief: "", technologies: [], repo: "", image: "", imageFile: null });
      setImgPreview("");
    }
  }, [initial, open]);

  if (!open) return null;

  // Tags input para tecnologías
  const handleTechKeyDown = (e) => {
    if (
      (e.key === " " || e.key === "Enter" || e.key === ",") &&
      e.target.value.trim()
    ) {
      e.preventDefault();
      const value = e.target.value.trim();
      if (value && !form.technologies.includes(value)) {
        setForm((prev) => ({
          ...prev,
          technologies: [...prev.technologies, value],
        }));
      }
      e.target.value = "";
    }
  };

  const handleTechRemove = (idx) => {
    setForm((prev) => ({
      ...prev,
      technologies: prev.technologies.filter((_, i) => i !== idx),
    }));
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm((prev) => ({ ...prev, imageFile: file }));
    setImgPreview(URL.createObjectURL(file));
  };

  const submitForm = async (e) => {
    e.preventDefault();
    let dataToSend = { ...form };
    if (form.imageFile) {
      const imgData = new FormData();
      imgData.append("image", form.imageFile);
      const res = await axios.post(`${API_BASE}/api/upload-image`, imgData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      dataToSend.image = res.data.url;
    }
    delete dataToSend.imageFile;
    onSave(dataToSend);
  };

  return (
    <div className="modal-overlay-modern" onClick={onClose}>
      <div className="modal-content-modern" onClick={e => e.stopPropagation()}>
        <h2 className="modal-title">{initial ? "Editar" : "Agregar"} proyecto</h2>
        <form
          onSubmit={submitForm}
          style={{ display: "flex", flexDirection: "column", gap: 16 }}
          autoComplete="off"
        >
          <label>
            Nombre
            <input
              required
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              autoFocus
            />
          </label>
          <label>
            Descripción breve
            <input
              value={form.brief}
              onChange={e => setForm({ ...form, brief: e.target.value })}
            />
          </label>
          <label>
            Tecnologías
            <div className="tech-tags-input">
              {form.technologies.map((tech, idx) => (
                <span className="tech-badge tag-badge" key={tech + idx}>
                  {tech}
                  <button type="button" className="tag-remove" onClick={() => handleTechRemove(idx)}>&times;</button>
                </span>
              ))}
              <input
                className="tag-input"
                type="text"
                placeholder="Escribe y presiona espacio…"
                onKeyDown={handleTechKeyDown}
                style={{ flex: 1, minWidth: 70, background: "transparent", border: "none", outline: "none" }}
              />
            </div>
          </label>
          <label>
            Imagen (opcional)
            <input
              type="file"
              accept="image/*"
              onChange={handleImage}
              style={{ marginBottom: 6 }}
            />
            {imgPreview && (
              <div style={{ marginTop: 6 }}>
                <img
                  src={imgPreview}
                  alt="Vista previa"
                  style={{
                    width: 85,
                    height: 85,
                    objectFit: "cover",
                    borderRadius: 10,
                    border: "1px solid #334",
                    boxShadow: "0 2px 12px #0004",
                  }}
                />
              </div>
            )}
          </label>
          <label>
            Repositorio GitHub
            <input
              required
              value={form.repo}
              onChange={e => setForm({ ...form, repo: e.target.value })}
              placeholder="https://github.com/..."
              type="url"
            />
          </label>
          <div className="btn-group" style={{ justifyContent: "flex-end", gap: "1rem" }}>
            <button type="button" className="btn-outline" onClick={onClose}>
              Cancelar
            </button>
            <button className="btn-primary">{initial ? "Guardar" : "Agregar"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// COMPONENTE PRINCIPAL
export default function Projects() {
  const { username } = useParams();
  const [projects, setProjects] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const { profile } = useProfile();
  const navigate = useNavigate();

  // Determina usuario a mostrar
  const usuario = username || profile?.username;

  // Si estamos en modo demo (sin usuario ni username)
  const isDemo = !usuario;

  useEffect(() => {
    if (isDemo) {
      setProjects(demoProjects);
      return;
    }
    axios
      .get(`${API_BASE}/api/projects/${usuario}`)
      .then((r) => setProjects(r.data))
      .catch(() => setProjects([]));
  }, [usuario, isDemo]);

  // Solo el dueño puede editar
  const isOwner = profile && usuario && profile.username === usuario;

  // Botón volver: redirige al perfil correspondiente
  const handleBack = () => {
    if (username) {
      navigate(`/profile/${username}`);
    } else if (profile?.username) {
      navigate(`/profile/${profile.username}`);
    } else {
      navigate("/");
    }
  };

  // GUARDAR proyecto (add/edit)
  const handleSave = async (data) => {
    // Si estamos en modo demo, no se guarda en backend, solo en el array local
    if (isDemo) {
      setProjects((prev) =>
        editing
          ? prev.map((p) => (p.id === editing.id ? { ...editing, ...data } : p))
          : [...prev, { ...data, id: "demo-" + (prev.length + 1) }]
      );
      setModalOpen(false);
      setEditing(null);
      return;
    }

    // Cambios reales: actualizar también la demo si es el usuario demo
    if (profile?.username === "roberto3101") {
      // Guarda el proyecto real
      let res;
      if (editing) {
        res = await axios.put(`${API_BASE}/api/projects/${editing.id}`, data, {
          headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
        });
        setProjects((ps) => ps.map((p) => (p.id === editing.id ? res.data : p)));
      } else {
        res = await axios.post(`${API_BASE}/api/projects`, data, {
          headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
        });
        setProjects((ps) => [...ps, res.data]);
      }

      // ACTUALIZA los proyectos demo (opcional, solo localmente)
      setTimeout(() => {
        setProjects((prev) => {
          // Reemplaza demoProjects locales también para demo inmediata
          return prev.map((p) =>
            p.id?.toString().startsWith("demo-")
              ? { ...p, ...data }
              : p
          );
        });
      }, 400);
      setModalOpen(false);
      setEditing(null);
      return;
    }

    // Usuarios normales
    if (editing) {
      const res = await axios.put(`${API_BASE}/api/projects/${editing.id}`, data, {
        headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
      });
      setProjects((ps) => ps.map((p) => (p.id === editing.id ? res.data : p)));
    } else {
      const res = await axios.post(`${API_BASE}/api/projects`, data, {
        headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
      });
      setProjects((ps) => [...ps, res.data]);
    }
    setModalOpen(false);
    setEditing(null);
  };

  // ELIMINAR proyecto
  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar este proyecto?")) return;
    // Modo demo: borra del array local
    if (isDemo) {
      setProjects((prev) => prev.filter((p) => p.id !== id));
      return;
    }
    // Demo user: borra en backend real y en demo
    if (profile?.username === "roberto3101") {
      await axios.delete(`${API_BASE}/api/projects/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
      });
      setProjects((ps) => ps.filter((p) => p.id !== id));
      // Borra demo local
      setTimeout(() => {
        setProjects((prev) => prev.filter((p) => !p.id?.toString().startsWith("demo-")));
      }, 400);
      return;
    }
    // Usuarios normales
    await axios.delete(`${API_BASE}/api/projects/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
    });
    setProjects((ps) => ps.filter((p) => p.id !== id));
  };

  return (
    <section id="projects" className="projects-section">
      <div className="container">
        <button
          className="btn-cta back-btn"
          style={{ marginBottom: 18 }}
          onClick={handleBack}
        >
          ← Volver al perfil
        </button>
        <h2 className="projects-title">
          Proyectos{" "}
          {usuario ? <span style={{ fontWeight: 400 }}>de {usuario}</span> : <span style={{ fontWeight: 400 }}>(DEMO)</span>}
        </h2>
        {isOwner && (
          <div
            className="project-card"
            style={{
              display: "inline-flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 260,
              minWidth: 210,
              cursor: "pointer",
              border: "2px dashed var(--accent)",
              color: "var(--accent)",
              fontSize: "3.5rem",
              marginBottom: 24,
            }}
            onClick={() => {
              setEditing(null);
              setModalOpen(true);
            }}
            title="Agregar nuevo proyecto"
          >
            <span style={{ fontSize: "4rem", lineHeight: 1 }}>+</span>
            <div style={{ fontSize: "1rem", marginTop: 12 }}>Agregar proyecto</div>
          </div>
        )}
        <div className="project-grid">
          {projects.map(({ id, image, name, brief, technologies, repo }, idx) => (
            <article key={id || idx} className="project-card" style={{ position: "relative" }}>
              <div className="project-thumb">
                <img src={image || `${BASE_PATH}/imagenes/default.png`} alt={name} className="project-img" />
                <a
                  href={repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card-overlay"
                  aria-label={`Repositorio de ${name}`}
                >
                  <svg viewBox="0 0 24 24" width="48" height="48">
                    <path
                      fill="currentColor"
                      d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.28 3.44 9.75 8.21 11.33.6.11.79-.26.79-.58 0-.29-.01-1.04-.02-2.04-3.34.73-4.04-1.61-4.04-1.61-.55-1.38-1.33-1.75-1.33-1.75-1.09-.75.08-.73.08-.73 1.21.09 1.86 1.24 1.86 1.24 1.07 1.84 2.8 1.3 3.49.99.11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.31-.54-1.53.12-3.18 0 0 1.01-.32 3.3 1.23a11.55 11.55 0 0 1 3-.4c1.02 0 2.05.14 3 .4 2.3-1.55 3.3-1.23 3.3-1.23.66 1.65.25 2.87.13 3.19.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.49 5.93.43.37.81 1.1.81 2.22 0 1.6-.02 2.89-.02 3.29 0 .32.2.69.8.58C20.56 22.25 24 17.78 24 12.5 24 5.87 18.63.5 12 .5z"
                    />
                  </svg>
                </a>
                {isOwner && !isDemo && (
                  <div style={{ position: "absolute", top: 12, right: 12, zIndex: 2, display: "flex", gap: 4 }}>
                    <button
                      title="Editar"
                      style={{
                        background: "var(--surface)",
                        border: "none",
                        color: "var(--accent)",
                        borderRadius: 5,
                        padding: "3px 9px",
                        fontSize: 19,
                        cursor: "pointer",
                        marginRight: 2,
                        boxShadow: "0 2px 8px #0005",
                      }}
                      onClick={() => {
                        setEditing({ id, name, brief, technologies, repo, image });
                        setModalOpen(true);
                      }}
                    >
                      ✎
                    </button>
                    <button
                      title="Eliminar"
                      style={{
                        background: "#111",
                        border: "none",
                        color: "#fa7272",
                        borderRadius: 5,
                        padding: "3px 8px",
                        fontSize: 19,
                        cursor: "pointer",
                        boxShadow: "0 2px 8px #0005",
                      }}
                      onClick={() => handleDelete(id)}
                    >
                      🗑
                    </button>
                  </div>
                )}
              </div>
              <h3>{name}</h3>
              <p>{brief}</p>
              <div className="tech-list">
                {technologies && technologies.map((t) => (
                  <span key={t} className="tech-badge">{t}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
        <ProjectModal
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setEditing(null);
          }}
          onSave={handleSave}
          initial={editing}
        />
      </div>
    </section>
  );
}