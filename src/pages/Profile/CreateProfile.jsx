// ─── src/pages/Profile/CreateProfile.jsx ────────────────────────────────
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function CreateProfile() {
  const navigate = useNavigate();
  const [preview, setPreview] = useState(null);          // miniatura avatar
  const [avatar, setAvatar]   = useState(null);          // File
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  /* todos los campos del formulario */
  const [form, setForm] = useState({
    username: "",
    firstName: "",
    lastName: "",
    phone: "",
    email: "",            // se mostrará con valor por defecto
    website: "",
    languages: "",
    interests: "",
    about: "",
  });

  /* ----------- helpers ----------- */
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatar(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  /* ----------- submit ----------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      /* 1) sube la imagen (si hay) */
      let avatarUrl = "";
      if (avatar) {
        const fd = new FormData();
        fd.append("image", avatar);
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/upload-image`,
          fd,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        avatarUrl = data.url;
      }

      /* 2) envía el perfil */
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/profile`,
        { ...form, avatar: avatarUrl },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        }
      );

      /* 3) ¡listo! */
      navigate("/"); // o a tu página de perfil
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.msg || "No se pudo guardar el perfil. Intenta luego."
      );
    } finally {
      setLoading(false);
    }
  };

  /* ----------- UI ----------- */
  return (
    <main className="container create-profile">
      <h1>Completa tu perfil</h1>

      <form onSubmit={handleSubmit} className="profile-form">
        {/* AVATAR ---------------------------------------------------- */}
        <div className="avatar-field">
          <label className="avatar-label">
            {preview ? (
              <img src={preview} alt="Avatar preview" />
            ) : (
              <span className="avatar-placeholder">+</span>
            )}
            <input type="file" accept="image/*" onChange={handleFile} hidden />
          </label>
          <p>Foto de perfil</p>
        </div>

        {/* DATOS BÁSICOS -------------------------------------------- */}
        <div className="grid two-cols">
          <label>
            Nombre(s)
            <input
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
            />
          </label>
          <label>
            Apellidos
            <input
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
            />
          </label>
        </div>

        <label>
          Nombre de usuario
          <input
            name="username"
            required
            value={form.username}
            onChange={handleChange}
          />
        </label>

        <label>
          Correo
          <input
            type="email"
            name="email"
            required
            value={form.email}
            onChange={handleChange}
          />
        </label>

        <label>
          Teléfono
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
          />
        </label>

        <label>
          Sitio web
          <input
            name="website"
            placeholder="https://"
            value={form.website}
            onChange={handleChange}
          />
        </label>

        {/* CAMPOS MULTILÍNEA ---------------------------------------- */}
        <label>
          Idiomas
          <input
            name="languages"
            placeholder="Español, Inglés…"
            value={form.languages}
            onChange={handleChange}
          />
        </label>

        <label>
          Intereses - áreas en las que deseas desarrollarte
          <input
            name="interests"
            placeholder="Frontend, IA, DevOps…"
            value={form.interests}
            onChange={handleChange}
          />
        </label>

        <label>
          Sobre mí
          <textarea
            name="about"
            rows={4}
            value={form.about}
            onChange={handleChange}
          />
        </label>

        {error && <p className="form-error">{error}</p>}

        <button className="btn-login wide" disabled={loading}>
          {loading ? "Guardando…" : "Guardar perfil"}
        </button>
      </form>
    </main>
  );
}
