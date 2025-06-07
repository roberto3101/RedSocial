import React from "react";
import rob from "/imagenes/rob.jpg";
import { useProfile } from "../context/ProfileContext";

export default function Hero({ profile: profileProp }) {
  const contextProfile = useProfile().profile;
  const profile = profileProp || contextProfile;

  const avatarSrc = profile?.avatar || rob;
  const firstName = profile?.firstName || "Roberto";
  const cvUrl = profile?.cv || "/cvEsp.pdf";

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
            <a href="/blog" className="btn-cta">Leer el blog</a>
            <a
              href={cvUrl}
              className="btn-outline"
              target="_blank"
              rel="noopener noreferrer"
            >Descargar CV</a>
          </div>
        </div>
      </div>
    </section>
  );
}
