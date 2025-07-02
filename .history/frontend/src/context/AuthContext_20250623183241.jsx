import { createContext, useContext, useState, useEffect } from "react";

// ---------- contexto ----------
const AuthCtx = createContext();
export const useAuth = () => useContext(AuthCtx);

// ---------- provider ----------
export function AuthProvider({ children }) {
  // lee localStorage UNA vez
  const [token, setToken] = useState(() => localStorage.getItem("jwt") || null);

  /* utilidades */
  const login = (jwt) => {
    localStorage.setItem("jwt", jwt);
    setToken(jwt);
  };

  const logout = () => {
    localStorage.removeItem("jwt");
    setToken(null);
  };

  /* auto-log out si alguien borra la key en otra pestaña */
  useEffect(() => {
    const sync = (e) => {
      if (e.key === "jwt") setToken(e.newValue);
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  return (
    <AuthCtx.Provider value={{ token, login, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}


//src\context\AuthContext.jsx// Este contexto maneja la autenticación del usuario.
// Proporciona un token JWT y funciones para iniciar y cerrar sesión.