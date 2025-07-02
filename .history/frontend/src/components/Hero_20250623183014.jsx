import React from "react";
import rob from "/imagenes/rob.jpg";
import { useProfile } from "../context/ProfileContext";

// Helper para obtener URL absoluta al CV demo en cualquier entorno
function getDemoCvUrl() {
  // Si está en producción (por GitHub Pages)
  if (window.location.host.includes("github.io")) {
    return "/RedSocial/cvEsp.pdf";
  }
  // En desarrollo local
  return "/RedSocial/cvEsp.pdf"; // ¡Ojo! Cambia según tu estructura, usa siempre "/RedSocial/".
}

export default function Hero({ profile: profileProp }) {
  const contextProfile = useProfile().profile;
  const profile = profileProp || contextProfile;

  // Avatar y datos
  const avatarSrc = profile?.avatar || rob;
  const firstName = profile?.firstName || "Roberto";
  // Si hay CV subido, úsalo. Si no, el demo.
  const cvUrl =
    profile?.cv && profile.cv.endsWith(".pdf")
      ? profile.cv
      : getDemoCvUrl();

  // Si es un perfil con username, va a ese blog; si no, va al blog demo de roberto3101
  const blogUrl =
    profile?.username
      ? `/RedSocial/blog/user/${profile.username}`
      : "https://roberto3101.github.io/RedSocial/blog/user/roberto3101";

  return (
    <section className="hero">
      <div className="container hero-inner">
        <div className="hero-img" role="img" aria-label="Foto de Roberto">
          <img src={avatarSrc} alt="Foto de perfil" loading="lazy" />
        </div>
        <div className="hero-text">
          <h1>
            Hola, soy <span className="hilite">{firstName}</span> <span className="wave">👋</span>
          </h1>
          <p className="subtitle">
            {profile?.about?.slice(0, 120) ||
              "Full-Stack Developer · Web Performance Enthusiast · Mentor de futuros devs."}
          </p>
          <div className="btn-group">
            <a href={blogUrl} className="btn-cta">Leer el blog</a>
            <a
              href={cvUrl}
              className="btn-outline"
              target="_blank"
              rel="noopener noreferrer"
              download // Siempre fuerza descarga
            >Descargar CV</a>
          </div>
        </div>
      </div>
    </section>
  );
}