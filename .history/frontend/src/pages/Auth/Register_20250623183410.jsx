/* ────────────────────────────────────────────
   src/pages/Auth/Register.jsx
───────────────────────────────────────────── */
import { useState }      from "react";
import { Link, useNavigate } from "react-router-dom";
import axios             from "axios";

export default function Register() {
  const [form, setForm]       = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);
  const navigate              = useNavigate();

  /* ——— Manejar cambios ——— */
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  /* ——— Registro clásico ——— */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword)
      return setError("Las contraseñas no coinciden");

    setLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/register`,
        { email: form.email, password: form.password }
      );

      /* OK → pedir código */
      navigate(
        `/verify-email?email=${encodeURIComponent(form.email)}`,
        { replace: true }
      );
    } catch (err) {
      const msg =
        err.response?.data?.msg ||
        "Error al registrar. Intenta de nuevo.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  /* ——— Login social ——— */
  const oauthLogin = (provider) => {
    window.location.href =
      `${import.meta.env.VITE_API_URL}/auth/${provider}`;
  };

  /* ——— UI ——— */
  return (
    <main className="register-page">
      <div className="register-card">
        <h1>Crear cuenta</h1>

        <form onSubmit={handleSubmit} className="register-form">
          <label>
            Correo electrónico
            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
            />
          </label>

          <label>
            Contraseña
            <input
              type="password"
              name="password"
              required
              minLength={8}
              value={form.password}
              onChange={handleChange}
            />
          </label>

          <label>
            Confirmar contraseña
            <input
              type="password"
              name="confirmPassword"
              required
              minLength={8}
              value={form.confirmPassword}
              onChange={handleChange}
            />
          </label>

          {error && <p className="form-error">{error}</p>}

          <button
            type="submit"
            className="btn-login wide"
            disabled={loading}
          >
            {loading ? "Enviando…" : "Registrarme"}
          </button>
        </form>

        <div className="divider"><span>o regístrate con</span></div>

        <div className="oauth-buttons">
          <button
            className="oauth-btn google"
            onClick={() => oauthLogin("google")}
            disabled={loading}
          >
            <span className="icon" /> Google
          </button>
          <button
            className="oauth-btn facebook"
            onClick={() => oauthLogin("facebook")}
            disabled={loading}
          >
            <span className="icon" /> Facebook
          </button>
          <button
            className="oauth-btn github"
            onClick={() => oauthLogin("github")}
            disabled={loading}
          >
            <span className="icon" /> GitHub
          </button>
        </div>

        <p className="login-extra">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="link">Inicia sesión</Link>
        </p>
      </div>
    </main>
  );
}