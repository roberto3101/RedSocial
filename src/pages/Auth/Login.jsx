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

  const navigate = useNavigate();
  const cancelSource = useRef(null);
  const { login } = useAuth();
  const { setProfile } = useProfile();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

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
            <input
              type="password"
              name="password"
              required
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
            />
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