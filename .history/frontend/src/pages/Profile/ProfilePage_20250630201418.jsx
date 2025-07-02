import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import Navbar from "../../components/Navbar";
import Hero from "../../components/Hero";
import PostSection from "../../components/PostSection";
import About from "../../components/About";
import Contact from "../../components/Contact";
import Footer from "../../components/Footer";
import CustomCursor from "../../components/CustomCursor";
import CaveLink from "../../components/CaveLink";
import EditPostModal from "../../components/EditPostModal";
import FollowModal from "../../components/FollowModal";
import { useProfile } from "../../context/ProfileContext";

export default function ProfilePage() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [followModalOpen, setFollowModalOpen] = useState(false);
  const [followModalType, setFollowModalType] = useState("followers");

  const { profile: loggedProfile } = useProfile();
  const isOwnProfile =
    loggedProfile &&
    loggedProfile.username &&
    username &&
    loggedProfile.username.toLowerCase() === username.toLowerCase();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/profile/${username}`
        );
        setProfile(data);
        setFollowersCount(data.followersCount || 0);
        setFollowingCount(data.followingCount || 0);
        setError("");
      } catch {
        setError("Perfil no encontrado");
      } finally {
        setLoading(false);
      }
    })();
  }, [username]);

  useEffect(() => {
    if (!loggedProfile || !loggedProfile.username || isOwnProfile) return;

    const checkFollowStatus = async () => {
      try {
        const token = localStorage.getItem("jwt");
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/profile/${username}/follow-status`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setIsFollowing(data.isFollowing);
      } catch (err) {
        console.error("Error checking follow status:", err);
      }
    };

    checkFollowStatus();
  }, [username, loggedProfile, isOwnProfile]);

  const handleFollow = async () => {
    if (!loggedProfile || !loggedProfile.username) {
      alert("Debes iniciar sesión para seguir usuarios");
      return;
    }

    try {
      const token = localStorage.getItem("jwt");
      const method = isFollowing ? "DELETE" : "POST";
      
      await axios({
        method,
        url: `${import.meta.env.VITE_API_URL}/api/profile/${username}/follow`,
        headers: { Authorization: `Bearer ${token}` }
      });

      setIsFollowing(!isFollowing);
      setFollowersCount(prev => isFollowing ? prev - 1 : prev + 1);
    } catch (err) {
      console.error("Error following/unfollowing:", err);
      alert(err.response?.data?.msg || "Error al procesar la solicitud");
    }
  };

  const openFollowModal = (type) => {
    setFollowModalType(type);
    setFollowModalOpen(true);
  };

  if (loading) return <p>Cargando perfil...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <Navbar profile={profile} />
      <div className="profile-header-extended">
        <Hero profile={profile} isOwnProfile={isOwnProfile} />
        
        <div className="profile-stats">
          <button 
            className="stat-item stat-button"
            onClick={() => openFollowModal("followers")}
          >
            <span className="stat-number">{followersCount}</span>
            <span className="stat-label">Seguidores</span>
          </button>
          <button 
            className="stat-item stat-button"
            onClick={() => openFollowModal("following")}
          >
            <span className="stat-number">{followingCount}</span>
            <span className="stat-label">Siguiendo</span>
          </button>
        </div>

        {!isOwnProfile && loggedProfile && (
          <button 
            className={`follow-btn ${isFollowing ? 'following' : ''}`}
            onClick={handleFollow}
          >
            {isFollowing ? 'Dejar de seguir' : 'Seguir'}
          </button>
        )}
      </div>
      
      <PostSection username={profile.username} />
      <About profile={profile} isOwnProfile={isOwnProfile} />
      <Contact profile={profile} />
      <Footer />
      <CustomCursor />
      <CaveLink />
      {isOwnProfile && <EditPostModal />}
      
      <FollowModal
        isOpen={followModalOpen}
        onClose={() => setFollowModalOpen(false)}
        username={username}
        type={followModalType}
      />
    </>
  );
}