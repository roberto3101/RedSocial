import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { useProfile } from "../../context/ProfileContext";

export default function OAuthSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const { setProfile } = useProfile();

  useEffect(() => {
    const token = searchParams.get("token");
    
    if (!token) {
      navigate("/login");
      return;
    }

    const handleOAuthSuccess = async () => {
      try {
        // Guardar token
        login(token);

        // Consultar perfil
        const { data: profile } = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/profile`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Verificar si hay perfil completo
        const hasProfile = profile && Object.keys(profile).length > 0 && profile.username;
        
        if (hasProfile) {
          setProfile(profile);
          // Verificar si el perfil público existe
          try {
            await axios.get(
              `${import.meta.env.VITE_API_URL}/api/profile/${profile.username}`
            );
            navigate(`/profile/${profile.username}`);
          } catch {
            navigate("/create-profile");
          }
        } else {
          setProfile(null);
          navigate("/create-profile");
        }
      } catch (error) {
        console.error("Error en OAuth success:", error);
        navigate("/login");
      }
    };

    handleOAuthSuccess();
  }, [searchParams, navigate, login, setProfile]);

  return (
    <div className="oauth-success">
      <p>Procesando autenticación...</p>
    </div>
  );
}