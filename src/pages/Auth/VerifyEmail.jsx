import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

export default function VerifyEmail() {
  const [params] = useSearchParams();
  const email = params.get("email") || "";          // viene de ?email=...
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!code) return setError("Ingresa el código");

    setLoading(true);
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/verify-email`,
        { email, code }
      );
      /* token OK → guarda y redirige */
      localStorage.setItem("jwt", data.token);
      navigate("/create-profile", { replace: true });
    } catch (err) {
      setError(err.response?.data?.msg || "Código inválido");
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
      </div>
    </main>
  );
}
