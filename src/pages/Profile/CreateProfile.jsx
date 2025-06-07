import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useProfile } from "../../context/ProfileContext";
import { useAuth } from "../../context/AuthContext";

export default function CreateProfile() {
  const navigate = useNavigate();
  const { profile, setProfile } = useProfile();
  const { token } = useAuth();

  /* --- estado local --- */
  const [preview, setPreview] = useState(null);
  const [avatar, setAvatar]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

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

  /* Prefill cuando ya hay perfil */
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
  }, [profile]);

  /* --------- helpers --------- */
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatar(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  /* --------- submit --------- */
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
      /* 1) sube imagen si la cambió */
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

      /* 2) upsert perfil (POST /api/profile) */
      const { data: saved } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/profile`,
        { ...form, avatar: avatarUrl },
        { headers: authHeader }
      );

      /* 3) actualiza contexto */
      setProfile(saved);

      /* 4) redirige al perfil público */
      if (saved.username) {
        navigate(`/profile/${saved.username}`);
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.msg ||
          "No se pudo guardar el perfil. Intenta luego."
      );
    } finally {
      setLoading(false);
    }
  };

  /* --------- UI --------- */
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

        {/* DATOS BÁSICOS */}
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
          <input name="phone" value={form.phone} onChange={handleChange} />
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