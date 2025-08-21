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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate              = useNavigate();

  /* ——— Manejar cambios ——— */
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  /* ——— Toggle contraseñas ——— */
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  /* ——— Registro clásico ——— */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword)
      return setError("Las contraseñas no coinciden");

    setLoading(true);
    try {
   const response = await axios.post(
  `${import.meta.env.VITE_API_URL}/auth/register`,
  { email: form.email, password: form.password }
);

/* Si hay token = login directo, si no = verificación */
if (response.data.token) {
  localStorage.setItem("jwt", response.data.token);
  navigate("/create-profile", { replace: true });
} else {
  navigate(
    `/verify-email?email=${encodeURIComponent(form.email)}`,
    { replace: true }
  );
}
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
            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                minLength={8}
                value={form.password}
                onChange={handleChange}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {showPassword ? (
                    // Ojo cerrado (slash)
                    <>
                      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                      <line x1="2" y1="2" x2="22" y2="22" />
                    </>
                  ) : (
                    // Ojo abierto
                    <>
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </>
                  )}
                </svg>
              </button>
            </div>
          </label>

          <label>
            Confirmar contraseña
            <div className="password-field">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                required
                minLength={8}
                value={form.confirmPassword}
                onChange={handleChange}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={toggleConfirmPasswordVisibility}
                aria-label={showConfirmPassword ? "Ocultar confirmación" : "Mostrar confirmación"}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {showConfirmPassword ? (
                    // Ojo cerrado (slash)
                    <>
                      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                      <line x1="2" y1="2" x2="22" y2="22" />
                    </>
                  ) : (
                    // Ojo abierto
                    <>
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </>
                  )}
                </svg>
              </button>
            </div>
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