// src/pages/Profile/ProfilePage.jsx
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

export default function ProfilePage() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

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
  if (error)   return <p>{error}</p>;

  return (
    <>
      <Navbar profile={profile} />
      <Hero profile={profile} />
      <PostSection username={profile.username} />
      <About profile={profile} />
      <Contact profile={profile} />
      <Footer />
      <CustomCursor />
      <CaveLink />
      <EditPostModal />
    </>
  );
}
