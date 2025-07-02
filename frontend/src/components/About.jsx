import rob from "/imagenes/rob.jpg";
import { useProfile } from "../context/ProfileContext";
import { useState } from "react";
import EditProfileModal from "./EditProfileModal";

export default function About({ profile: profileProp }) {
  const contextProfile = useProfile().profile;
  const profile = profileProp || contextProfile;
  const [modalOpen, setModalOpen] = useState(false);

  const avatarSrc = profile?.avatar || rob;
  const fullName =
    profile?.firstName && profile?.lastName
      ? `${profile.firstName} ${profile.lastName}`
      : profile?.firstName || profile?.username || "Roberto Larosa";
  const aboutText =
    profile?.about ||
    "¡Hola! Soy Roberto Larosa, Desarrollador de Software venezolano afincado en Perú. Me apasiona crear experiencias web de alto rendimiento con React, Node.js y herramientas cloud-native. Aquí comparto lo que aprendo para impulsar a la comunidad dev.";
  const stack = profile?.languages
    ? profile.languages.split(",").map((t) => t.trim())
    : ["React", "Node.js", "Java", "MySQL", "Javascript", "SQL Server"];

  // Solo permite editar si está logeado **Y** está viendo su propio perfil
  const isOwner =
    !!localStorage.getItem("jwt") &&
    profile?.username &&
    contextProfile?.username &&
    profile.username === contextProfile.username;

  return (
    <section id="about" className="about">
      <div className="container about-inner">
        <div className="about-img" role="img" aria-label={`Foto de ${fullName}`}>
          <img src={avatarSrc} alt={fullName} loading="lazy" />
        </div>
        <div className="about-content">
          <h2>Sobre mí</h2>
          <p className="about-intro">{aboutText}</p>
          <ul className="about-stats">
            <li>
              <span className="stat-num">{profile?.experience || 2}+</span>
              <span className="stat-label">años de experiencia</span>
            </li>
            <li>
              <span className="stat-num">{profile?.codeLines || "30 K"}</span>
              <span className="stat-label">líneas de código<br />mantenidas</span>
            </li>
            <li>
              <span className="stat-num">{profile?.deployed || 15}</span>
              <span className="stat-label">proyectos<br />deployados</span>
            </li>
          </ul>
          <div className="tech-stack">
            {stack.map((tech) => (
              <span key={tech} className="tech-tag">{tech}</span>
            ))}
          </div>
          {isOwner && (
            <button className="btn-outline" style={{ marginTop: 16 }} onClick={() => setModalOpen(true)}>
              Editar perfil
            </button>
          )}
        </div>
        <EditProfileModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      </div>
    </section>
  );
}