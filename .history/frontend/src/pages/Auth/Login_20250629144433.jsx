// src/pages/Auth/Login.jsx
import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { useProfile } from "../../context/ProfileContext";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const cancelSource = useRef(null);
  const { login } = useAuth();
  const { setProfile } = useProfile();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Completa ambos campos");
      return;
    }

    setLoading(true);
    try {
      cancelSource.current = axios.CancelToken.source();

      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        form,
        {
          withCredentials: false,
          cancelToken: cancelSource.current.token,
        }
      );

      login(data.token);

      const { data: profile } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/profile`,
        {
          headers: { Authorization: `Bearer ${data.token}` },
        }
      );

      if (profile && profile.username) {
        const username = profile.username.toLowerCase().trim();
        setProfile(profile);
        navigate(`/profile/${username}`);
      } else {
        navigate("/create-profile");
      }
    } catch (err) {
      if (axios.isCancel(err)) return;
      const msg =
        err.response?.data?.msg ||
        (err.response?.status === 500
          ? "Error del servidor. Inténtalo más tarde."
          : "Credenciales incorrectas. Intenta de nuevo.");
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const oauthLogin = (provider) =>
    (window.location.href = `${import.meta.env.VITE_API_URL}/auth/${provider}`);

  useEffect(() => () => cancelSource.current?.cancel(), []);

  return (
    <main className="login-page">
      <div className="login-card">
        <h1>Iniciar sesión</h1>

        <form onSubmit={handleSubmit} className="login-form">
          <label>
            Correo electrónico
            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
              autoComplete="username"
            />
          </label>

          <label>
            Contraseña
            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
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

          {error && <p className="form-error">{error}</p>}

          <button type="submit" className="btn-login wide" disabled={loading}>
            {loading ? "Ingresando…" : "Entrar"}
          </button>
        </form>

        <div className="divider">
          <span>o inicia sesión con</span>
        </div>

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
          ¿No tienes cuenta? <Link to="/register" className="link">Regístrate</Link>
        </p>
      </div>
    </main>
  );
}