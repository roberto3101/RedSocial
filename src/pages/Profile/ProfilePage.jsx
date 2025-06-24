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
import { useProfile } from "../../context/ProfileContext";

export default function ProfilePage() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Trae el perfil del usuario logueado (desde contexto)
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
        setError("");
      } catch {
        setError("Perfil no encontrado");
      } finally {
        setLoading(false);
      }
    })();
  }, [username]);

  if (loading) return <p>Cargando perfil...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <Navbar profile={profile} />
      <Hero profile={profile} isOwnProfile={isOwnProfile} />
      <PostSection username={profile.username} />
      <About profile={profile} isOwnProfile={isOwnProfile} />
      <Contact profile={profile} />
      <Footer />
      <CustomCursor />
      <CaveLink />
      {/* Solo muestra el modal de edición si es tu propio perfil */}
      {isOwnProfile && <EditPostModal />}
    </>
  );
}