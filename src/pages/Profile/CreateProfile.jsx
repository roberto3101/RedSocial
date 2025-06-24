import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useProfile } from "../../context/ProfileContext";
import { useAuth } from "../../context/AuthContext";

export default function CreateProfile() {
  const navigate = useNavigate();
  const { profile, setProfile } = useProfile();
  const { token } = useAuth();

  const [avatarUploading, setAvatarUploading] = useState(false);
  const [cvUploading, setCvUploading] = useState(false);
  const [cvUrl, setCvUrl] = useState(profile?.cv || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    username:  "",
    firstName: "",
    lastName:  "",
    phone:     "",
    email:     "",
    website:   "",
    languages: "",
    interests: "",
    about:     "",
    avatar:    "",
    cv:        "",
  });

  useEffect(() => {
    if (!profile) return;
    setForm({
      username:  profile.username  || "",
      firstName: profile.firstName || "",
      lastName:  profile.lastName  || "",
      phone:     profile.phone     || "",
      email:     profile.email     || "",
      website:   profile.website   || "",
      languages: profile.languages || "",
      interests: profile.interests || "",
      about:     profile.about     || "",
      avatar:    profile.avatar    || "",
      cv:        profile.cv        || "",
    });
    if (profile.cv) setCvUrl(profile.cv);
  }, [profile]);

  // Subida de avatar
  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarUploading(true);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/upload-image`,
        fd,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setForm(f => ({ ...f, avatar: data.url }));
    } catch {
      alert("Error al subir la imagen.");
    } finally {
      setAvatarUploading(false);
    }
  };

  // Subida de CV
  const handleCvFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      alert("Solo se permite formato PDF para el CV.");
      return;
    }
    setCvUploading(true);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/upload-image`,
        fd,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setForm(f => ({ ...f, cv: data.url }));
      setCvUrl(data.url);
    } catch {
      alert("Error al subir el CV.");
    } finally {
      setCvUploading(false);
    }
  };

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!token) {
      setError("No estás autenticado");
      setLoading(false);
      return;
    }
    const authHeader = { Authorization: `Bearer ${token}` };

    try {
      // Guarda el perfil (con avatar y cv ya subidos)
      const { data: saved } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/profile`,
        { ...form },
        { headers: authHeader }
      );

      setProfile(saved);

      if (saved.cv) setCvUrl(saved.cv);

      if (saved.username) {
        navigate(`/profile/${saved.username}`);
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(
        err.response?.data?.msg ||
        "No se pudo guardar el perfil. Intenta luego."
      );
    } finally {
      setLoading(false);
    }
  };

  // Render
  return (
    <main className="container create-profile">
      <h1>{profile ? "Editar" : "Completa"} tu perfil</h1>
      <form onSubmit={handleSubmit} className="profile-form">
        {/* AVATAR */}
        <div className="avatar-field">
          <label className="avatar-label">
            {form.avatar ? (
              <img src={form.avatar} alt="Avatar" />
            ) : (
              <span className="avatar-placeholder">+</span>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleFile}
              hidden
              disabled={avatarUploading}
            />
          </label>
          <p>Foto de perfil {avatarUploading && <span>Subiendo...</span>}</p>
        </div>

        {/* DATOS */}
        <div className="grid two-cols">
          <label>
            Nombre(s)
            <input name="firstName" value={form.firstName} onChange={handleChange} />
          </label>
          <label>
            Apellidos
            <input name="lastName" value={form.lastName} onChange={handleChange} />
          </label>
        </div>
        <label>
          Nombre de usuario
          <input name="username" required value={form.username} onChange={handleChange} />
        </label>
        <label>
          Correo
          <input type="email" name="email" required value={form.email} onChange={handleChange} />
        </label>
        <label>
          Teléfono
          <input name="phone" value={form.phone} onChange={handleChange} />
        </label>
        <label>
          Sitio web
          <input name="website" placeholder="https://" value={form.website} onChange={handleChange} />
        </label>
        <label>
          Idiomas
          <input name="languages" placeholder="Español, Inglés…" value={form.languages} onChange={handleChange} />
        </label>
        <label>
          Intereses - áreas en las que deseas desarrollarte
          <input name="interests" placeholder="Frontend, IA, DevOps…" value={form.interests} onChange={handleChange} />
        </label>
        <label>
          Sobre mí
          <textarea name="about" rows={4} value={form.about} onChange={handleChange} />
        </label>

        {/* Campo subir CV */}
        <label>
          Adjuntar CV (PDF)
          <input type="file" accept="application/pdf" onChange={handleCvFile} disabled={cvUploading} />
          {cvUploading && <span style={{ marginLeft: 8 }}>Subiendo...</span>}
          {form.cv && (
            <span style={{ display: "block", marginTop: 4, fontSize: 13 }}>
              <a href={form.cv} target="_blank" rel="noopener noreferrer">
                Ver CV actual
              </a>
            </span>
          )}
        </label>

        {error && <p className="form-error">{error}</p>}

        <button className="btn-login wide" disabled={loading}>
          {loading ? "Guardando…" : "Guardar perfil"}
        </button>
      </form>
    </main>
  );
}
