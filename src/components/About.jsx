import React from "react";
import rob from "/imagenes/rob.jpg";        // ⇦ usa la misma foto redonda

export default function About() {
  return (
    <section id="about" className="about">
      <div className="container about-inner">

        {/* Foto / avatar */}
        <div className="about-img" role="img" aria-label="Foto de Roberto">
          <img src={rob} alt="Roberto Larosa" loading="lazy" />
        </div>

        {/* Texto y datos */}
        <div className="about-content">
          <h2>Sobre mí</h2>
          <p className="about-intro">
            ¡Hola! Soy <span className="hilite">Roberto Larosa</span>, Desarrollador de Software
            de software venezolano afincado en Perú. Me apasiona crear
            experiencias web de alto rendimiento con React, Node.js y
            herramientas cloud-native. Aquí comparto lo que aprendo para
            impulsar a la comunidad dev.
          </p>

          {/* Stats rápidas */}
          <ul className="about-stats">
            <li>
              <span className="stat-num">2+</span>
              <span className="stat-label">años de experiencia</span>
            </li>
            <li>
              <span className="stat-num">30&nbsp;K</span>
              <span className="stat-label">líneas de código<br />mantenidas</span>
            </li>
            <li>
              <span className="stat-num">15</span>
              <span className="stat-label">proyectos<br />deployados</span>
            </li>
          </ul>

          {/* Tech stack destacado */}
          <div className="tech-stack">
            {["React", "Node.js", "Java", "MySQL", "Javascript", "SQL Server"].map(
              tech => (
                <span key={tech} className="tech-tag">{tech}</span>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
