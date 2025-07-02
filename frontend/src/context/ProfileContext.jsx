import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

/* Valor por defecto – evita crashes si el Provider falta */
const ProfileContext = createContext({
  profile: null,
  setProfile: () => {},
  loading: true,
});

/* ─── Provider global ─────────────────────────────────────── */
export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  /* Al arrancar la app consulta el perfil (si hay token) */
  useEffect(() => {
    const token = localStorage.getItem("jwt");

    /* Sin sesión → no consultamos API */
    if (!token) {
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/profile`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        /* El backend devuelve {} cuando aún no hay perfil */
        const hasRealProfile = data && Object.keys(data).length > 0 && data.username;
        setProfile(hasRealProfile ? data : null);
      } catch (err) {
        console.error("Profile load:", err.response?.statusText || err.message);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <ProfileContext.Provider value={{ profile, setProfile, loading }}>
      {children}
    </ProfileContext.Provider>
  );
}

/* Hook de conveniencia */
export const useProfile = () => useContext(ProfileContext);