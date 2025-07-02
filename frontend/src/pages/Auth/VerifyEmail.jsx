import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

export default function VerifyEmail() {
  const [params] = useSearchParams();
  const email = params.get("email") || "";
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resent, setResent] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  if (!email) {
    return (
      <main className="login-page">
        <div className="login-card">
          <h1>Verifica tu correo</h1>
          <p>Introduce el correo para reenviar el código:</p>
          <ResendCodeForm />
        </div>
      </main>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!code) return setError("Ingresa el código");

    setLoading(true);
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/verify-email`,
        { email, code }
      );
      localStorage.setItem("jwt", data.token);
      navigate("/create-profile", { replace: true });
    } catch (err) {
      setError(err.response?.data?.msg || "Código inválido");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/register`,
        { email }
      );
      setResent(true);
      setCooldown(30);
    } catch (err) {
      setError("No se pudo reenviar el código.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <div className="login-card">
        <h1>Verifica tu correo</h1>
        <p style={{ marginBottom: "1rem" }}>
          Introduce el código que enviamos a <strong>{email}</strong>
        </p>

        <form onSubmit={handleSubmit} className="login-form">
          <label>
            Código (6 dígitos)
            <input
              type="text"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </label>

          {error && <p className="form-error">{error}</p>}

          <button type="submit" className="btn-login wide" disabled={loading}>
            {loading ? "Verificando…" : "Confirmar"}
          </button>
        </form>
        <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
          <button
            type="button"
            className="btn-outline"
            onClick={handleResend}
            disabled={loading || cooldown > 0}
            style={{ width: "100%" }}
          >
            {cooldown > 0 ? `Reenviar en ${cooldown}s` : "¿No recibiste el código? Reenviar"}
          </button>
          {resent && <p className="tooltip" style={{ color: "#14e956" }}>¡Código reenviado!</p>}
        </div>
      </div>
    </main>
  );
}

function ResendCodeForm() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResend = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/register`,
        { email }
      );
      setSent(true);
    } catch (err) {
      setError("No se pudo enviar el código.");
    } finally {
      setLoading(false);
    }
  };

  return sent ? (
    <p style={{ color: "#14e956" }}>¡Revisa tu correo! Ahora ingresa desde el link del email.</p>
  ) : (
    <form onSubmit={handleResend} className="login-form">
      <input
        type="email"
        required
        value={email}
        placeholder="Correo electrónico"
        onChange={(e) => setEmail(e.target.value)}
      />
      {error && <p className="form-error">{error}</p>}
      <button type="submit" className="btn-login wide" disabled={loading}>
        {loading ? "Enviando…" : "Reenviar código"}
      </button>
    </form>
  );
}