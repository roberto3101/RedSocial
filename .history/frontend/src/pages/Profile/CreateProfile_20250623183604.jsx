import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useProfile } from "../../context/ProfileContext";
import { useAuth } from "../../context/AuthContext";

export default function CreateProfile() {
  const navigate = useNavigate();
  const { profile, setProfile } = useProfile();
  const { token } = useAuth();

  const [preview, setPreview] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [cv, setCv] = useState(null);
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
    });
    if (profile.avatar) setPreview(profile.avatar);
    if (profile.cv) setCvUrl(profile.cv);
  }, [profile]);

  // Subida de avatar
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatar(file);
    setPreview(URL.createObjectURL(file));
  };

  // Subida de CV
  const handleCvFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      alert("Solo se permite formato PDF para el CV.");
      return;
    }
    setCv(file);
    setCvUrl(""); // Limpia la vista previa hasta subirlo
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
      // 1. Sube avatar si la cambió
      let avatarUrl = profile?.avatar || "";
      if (avatar) {
        const fd = new FormData();
        fd.append("image", avatar);
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/upload-image`,
          fd,
          {
            headers: {
              ...authHeader,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        avatarUrl = data.url;
      }

      // 2. Sube CV si lo subió
      let finalCvUrl = profile?.cv || "";
      if (cv) {
        const fd = new FormData();
        fd.append("image", cv);
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/upload-image`,
          fd,
          {
            headers: {
              ...authHeader,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        finalCvUrl = data.url;
      }

      // 3. Upsert perfil (guarda avatar y CV en el perfil)
      const { data: saved } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/profile`,
        { ...form, avatar: avatarUrl, cv: finalCvUrl },
        { headers: authHeader }
      );

      setProfile(saved);  // <--- El contexto se actualiza aquí con el nuevo CV

      if (saved.cv) setCvUrl(saved.cv); // Esto asegura que la vista previa del enlace funcione tras crear perfil

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
            {preview ? (
              <img src={preview} alt="Avatar preview" />
            ) : (
              <span className="avatar-placeholder">+</span>
            )}
            <input type="file" accept="image/*" onChange={handleFile} hidden />
          </label>
          <p>Foto de perfil</p>
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
          <input type="file" accept="application/pdf" onChange={handleCvFile} />
          {cvUrl && (
            <span style={{ display: "block", marginTop: 4, fontSize: 13 }}>
              <a href={cvUrl} target="_blank" rel="noopener noreferrer">
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