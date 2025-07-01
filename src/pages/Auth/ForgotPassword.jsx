// src/pages/Auth/ForgotPassword.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // 1: email, 2: código, 3: nueva contraseña
  const [form, setForm] = useState({
    email: "",
    code: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetToken, setResetToken] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(""); // Limpiar error al escribir
  };

  // Paso 1: Solicitar código de reset
  const handleRequestReset = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email) {
      setError("Ingresa tu correo electrónico");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/forgot-password`,
        { email: form.email }
      );

      setStep(2);
      setError(""); // Limpiar cualquier error anterior

    } catch (err) {
      setError(
        err.response?.data?.msg || 
        "Error al enviar el código. Intenta de nuevo."
      );
    } finally {
      setLoading(false);
    }
  };

  // Paso 2: Verificar código
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.code || form.code.length !== 6) {
      setError("Ingresa el código de 6 dígitos");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/verify-reset-code`,
        { email: form.email, code: form.code }
      );

      setResetToken(data.resetToken);
      setStep(3);
      setError("");

    } catch (err) {
      setError(
        err.response?.data?.msg || 
        "Código inválido o expirado"
      );
    } finally {
      setLoading(false);
    }
  };

  // Paso 3: Cambiar contraseña
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.newPassword || form.newPassword.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/reset-password`,
        { resetToken, newPassword: form.newPassword }
      );

      // Redirigir al login con mensaje de éxito
      navigate("/login", { 
        state: { 
          successMessage: "Contraseña cambiada exitosamente. Inicia sesión con tu nueva contraseña." 
        }
      });

    } catch (err) {
      setError(
        err.response?.data?.msg || 
        "Error al cambiar la contraseña. Intenta de nuevo."
      );
    } finally {
      setLoading(false);
    }
  };

  // Reenviar código
  const handleResendCode = async () => {
    if (resendCooldown > 0) return;

    setLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/resend-reset-code`,
        { email: form.email }
      );

      // Cooldown de 60 segundos
      setResendCooldown(60);
      const timer = setInterval(() => {
        setResendCooldown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

    } catch (err) {
      setError(
        err.response?.data?.msg || 
        "Error al reenviar el código"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page forgot-password-page">
      <div className="login-card">
        
        {/* Paso 1: Solicitar email */}
        {step === 1 && (
          <>
            <h1>Recuperar contraseña</h1>
            <p className="forgot-description">
              Ingresa tu correo electrónico y te enviaremos un código para restablecer tu contraseña.
            </p>

            <form onSubmit={handleRequestReset} className="login-form">
              <label>
                Correo electrónico
                <input
                  type="email"
                  name="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="tu@email.com"
                  autoComplete="email"
                />
              </label>

              {error && <p className="form-error">{error}</p>}

              <button type="submit" className="btn-login wide" disabled={loading}>
                {loading ? "Enviando…" : "Enviar código"}
              </button>
            </form>

            <p className="login-extra">
              ¿Recordaste tu contraseña? <Link to="/login" className="link">Iniciar sesión</Link>
            </p>
          </>
        )}

        {/* Paso 2: Verificar código */}
        {step === 2 && (
          <>
            <h1>Verificar código</h1>
            <p className="forgot-description">
              Hemos enviado un código de 6 dígitos a <strong>{form.email}</strong>
            </p>

            <form onSubmit={handleVerifyCode} className="login-form">
              <label>
                Código de verificación
                <input
                  type="text"
                  name="code"
                  required
                  maxLength="6"
                  value={form.code}
                  onChange={handleChange}
                  placeholder="123456"
                  autoComplete="one-time-code"
                  className="code-input"
                />
              </label>

              {error && <p className="form-error">{error}</p>}

              <button type="submit" className="btn-login wide" disabled={loading}>
                {loading ? "Verificando…" : "Verificar código"}
              </button>
            </form>

            <div className="resend-section">
              {resendCooldown > 0 ? (
                <p className="resend-text">
                  Puedes solicitar un nuevo código en {resendCooldown}s
                </p>
              ) : (
                <button 
                  type="button" 
                  className="resend-btn" 
                  onClick={handleResendCode}
                  disabled={loading}
                >
                  Reenviar código
                </button>
              )}
            </div>

            <p className="login-extra">
              <Link to="/login" className="link">← Volver al login</Link>
            </p>
          </>
        )}

        {/* Paso 3: Nueva contraseña */}
        {step === 3 && (
          <>
            <h1>Nueva contraseña</h1>
            <p className="forgot-description">
              Crea una nueva contraseña para tu cuenta.
            </p>

            <form onSubmit={handleResetPassword} className="login-form">
              <label>
                Nueva contraseña
                <div className="password-field">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    name="newPassword"
                    required
                    minLength="8"
                    value={form.newPassword}
                    onChange={handleChange}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    aria-label={showNewPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
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
                    minLength="8"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? "Ocultar confirmación" : "Mostrar confirmación"}
                  >
                  </button>
                </div>
              </label>

              {error && <p className="form-error">{error}</p>}

              <button type="submit" className="btn-login wide" disabled={loading}>
                {loading ? "Cambiando…" : "Cambiar contraseña"}
              </button>
            </form>
          </>
        )}
      </div>
    </main>
  );
}