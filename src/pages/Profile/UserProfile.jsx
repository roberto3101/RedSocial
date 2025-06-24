import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE } from "../../lib/apiBase";

export default function UserProfile() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    axios
      .get(`${API_BASE}/api/profile/${username}`)
      .then((res) => alive && setProfile(res.data))
      .catch(() => alive && setProfile(null))
      .finally(() => alive && setLoading(false));
    return () => { alive = false };
  }, [username]);

  if (loading) return <div className="profile-loading">Cargando perfil...</div>;
  if (!profile || !profile.username) return <div className="profile-notfound">Perfil no encontrado.</div>;

  return (
    <div className="user-profile-public">
      <div className="profile-card">
        <img
          src={profile.avatar || "/default-avatar.png"}
          alt={profile.username}
          className="profile-avatar"
          style={{ width: 120, height: 120, objectFit: "cover", borderRadius: "100px", marginBottom: 16 }}
        />
        <h2>@{profile.username}</h2>
        <h3>{profile.firstName} {profile.lastName}</h3>
        {profile.about && <p className="profile-about">{profile.about}</p>}
        <ul className="profile-meta">
          {profile.email && <li><b>Email:</b> {profile.email}</li>}
          {profile.interests && <li><b>Intereses:</b> {profile.interests}</li>}
          {profile.languages && <li><b>Idiomas:</b> {profile.languages}</li>}
          {profile.website && <li><b>Web:</b> <a href={profile.website} target="_blank" rel="noopener noreferrer">{profile.website}</a></li>}
        </ul>
      </div>
    </div>
  );
}