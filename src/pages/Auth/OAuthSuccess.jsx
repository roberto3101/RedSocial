import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";          // 👈

export default function OAuthSuccess() {
  const { login } = useAuth();                                // 👈
  const navigate  = useNavigate();

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");
    if (token) {
      login(token);                                           // 🔥 avisa al contexto
      // limpia hash de Facebook
      if (window.location.hash === "#_=_") {
        window.history.replaceState(null, "", window.location.pathname);
      }
      navigate("/create-profile", { replace: true });
    } else {
      navigate("/login", { replace: true });
    }
  }, [login, navigate]);

  return (
    <main style={{ padding: "4rem", textAlign: "center" }}>
      <h1>Procesando inicio de sesión…</h1>
    </main>
  );
}
// Este componente se usa para manejar el éxito de OAuth
// y redirigir al usuario a la creación de perfil o al login.