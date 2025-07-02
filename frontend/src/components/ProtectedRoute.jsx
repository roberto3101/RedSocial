import { Navigate } from "react-router-dom";
import { useAuth }  from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
}
// Este componente protege rutas que requieren autenticación.
// Si el usuario no tiene un token, lo redirige al login.