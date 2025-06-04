/* ─── src/pages/Auth/Login.jsx ──────────────────────────────────────────── */
import { useState, useRef, useEffect }      from "react";
import { Link, useNavigate }                from "react-router-dom";
import axios                                from "axios";
import { useAuth }                          from "../../context/AuthContext";   // 👈 NUEVO

export default function Login() {
  /* ─────────── ESTADO ─────────── */
  const [form,    setForm]    = useState({ email: "", password: "" });
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const navigate     = useNavigate();
  const cancelSource = useRef(null);
  const { login }    = useAuth();                                             // 👈 NUEVO

  /* ─────────── HANDLERS ─────────── */
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  /* -------- Enviar credenciales -------- */
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
          withCredentials : false,                        // usa true si sirves JWT en cookie
          cancelToken     : cancelSource.current.token,
        }
      );

      /* token OK → actualizar contexto y redirigir */
      login(data.token);                                  // 👈  AHORA mediante el helper
      navigate("/create-profile");
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

  /* -------------- OAuth -------------- */
  const oauthLogin = (provider) =>
    (window.location.href = `${import.meta.env.VITE_API_URL}/auth/${provider}`);

  /* Abort si el componente se desmonta */
  useEffect(() => () => cancelSource.current?.cancel(), []);

  /* ─────────── UI ─────────── */
  return (
    <main className="login-page">
      <div className="login-card">
        <h1>Iniciar sesión</h1>

        {/* ---------- Login clásico ---------- */}
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

        {/* ---------- Separador ---------- */}
        <div className="divider">
          <span>o inicia sesión con</span>
        </div>

        {/* ---------- Botones OAuth ---------- */}
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
