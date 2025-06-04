// src/pages/Projects/Projects.jsx
import React from "react";
import { Link } from "react-router-dom";

const projects = [
  {
    image: "/imagenes/BiblioSystem.jpg",
    name: "BiblioSystem",
    brief:
      "Sistema de gestión de bibliotecas con login, roles y CRUD para libros y alumnos.",
    technologies: ["Java", "MySQL", "Tomcat"],
    repo: "https://github.com/roberto3101"
  },
  {
    image: "/imagenes/CRUD.jpg",
    name: "CRUD App",
    brief: "CRUD sencillo con React y MySQL.",
    technologies: ["React", "SqlServer", "Node.js"],
    repo: "https://github.com/roberto3101"
  },
  {
    image: "/imagenes/Thenx.png",
    name: "Web de ejercicios",
    brief:
      "Aplicación para gestionar rutinas y progreso de entrenamiento.",
    technologies: ["HTML", "CSS", "JavaScript"],
    repo: "https://github.com/roberto3101"
  },
  {
    image: "/imagenes/highrise.png",
    name: "Bots JS / Node",
    brief:
      "Bots en Node.js para automatizar emotes, teleports, roles y donaciones.",
    technologies: ["JavaScript", "Node.js"],
    repo: "https://github.com/roberto3101"
  }
];

export default function Projects() {
  return (
    <section id="projects" className="projects-section">
      <div className="container">
        {/* Botón regresar */}
        <Link to="/" className="btn-cta back-btn">
          ← Volver al inicio
        </Link>

        <h2 className="projects-title">Algunos proyectos</h2>

        <div className="project-grid">
          {projects.map(({ image, name, brief, technologies, repo }) => (
            <article key={name} className="project-card">
              {/* mini-wrapper para overlay */}
              <div className="project-thumb">
                <img src={image} alt={name} className="project-img" />
                {/* overlay + link GitHub */}
                <a
                  href={repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card-overlay"
                  aria-label={`Repositorio de ${name}`}
                >
                  {/* icono GitHub simple (SVG) */}
                  <svg viewBox="0 0 24 24" width="48" height="48">
                    <path
                      fill="currentColor"
                      d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.28 3.44 9.75 8.21 11.33.6.11.79-.26.79-.58 0-.29-.01-1.04-.02-2.04-3.34.73-4.04-1.61-4.04-1.61-.55-1.38-1.33-1.75-1.33-1.75-1.09-.75.08-.73.08-.73 1.21.09 1.86 1.24 1.86 1.24 1.07 1.84 2.8 1.3 3.49.99.11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.31-.54-1.53.12-3.18 0 0 1.01-.32 3.3 1.23a11.55 11.55 0 0 1 3-.4c1.02 0 2.05.14 3 .4 2.3-1.55 3.3-1.23 3.3-1.23.66 1.65.25 2.87.13 3.19.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.49 5.93.43.37.81 1.1.81 2.22 0 1.6-.02 2.89-.02 3.29 0 .32.2.69.8.58C20.56 22.25 24 17.78 24 12.5 24 5.87 18.63.5 12 .5z"
                    />
                  </svg>
                </a>
              </div>

              <h3>{name}</h3>
              <p>{brief}</p>

              <div className="tech-list">
                {technologies.map(t => (
                  <span key={t} className="tech-badge">{t}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
