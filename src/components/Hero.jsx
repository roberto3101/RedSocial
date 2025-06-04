// ─── src/components/Hero.jsx ───────────────────────────
import React from "react";
import { Link } from "react-router-dom";
import rob from "/imagenes/rob.jpg";

export default function Hero() {
  return (
    <section className="hero">
      <div className="container hero-inner">

        {/* FOTO */}
        <div className="hero-img" role="img" aria-label="Foto de Roberto">
          <img src={rob} alt="Roberto sonriente" loading="lazy" />
        </div>

        {/* TEXTO + CTAs */}
        <div className="hero-text">
          <h1>
            Hola, soy <span className="hilite">Roberto</span>{" "}
            <span className="wave">👋</span>
          </h1>

          <p className="subtitle">
            Full-Stack Developer · Web Performance Enthusiast · Mentor de futuros devs.
          </p>

          <div className="btn-group">
            {/* 🔗 Ahora va al índice de blog en /blog */}
            <Link to="/blog" className="btn-cta">
              Leer el blog
            </Link>

            {/* descarga CV */}
            <a
              href="/cvEsp.pdf"
              className="btn-outline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Descargar CV
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
