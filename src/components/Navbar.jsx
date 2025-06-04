import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();          // cierra menú al cambiar de ruta

  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
    return () => document.body.classList.remove("menu-open");
  }, [open]);

  useEffect(() => setOpen(false), [location.pathname]);

  return (
    <header className="navbar">
      <div className="container nav-content">
        <Link to="/" className="logo" onClick={() => setOpen(false)}>
          el blog de <span>roberto3101</span>
        </Link>

        {/* Botón hamburguesa */}
        <button
          className={`burger ${open ? "open" : ""}`}
          aria-label="Menú"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav>
          <ul
            className={`nav-links ${open ? "mobile-open" : ""}`}
            onClick={() => setOpen(false)}
          >
            <li><a href="#posts">Artículos</a></li>
            <li><Link to="/projects">Proyectos</Link></li>
            <li><a href="#about">Sobre mí</a></li>
            <li>
              <a href="#contact">
                <button className="btn-cta">Contacto</button>
              </a>
            </li>
            <li>
              <Link to="/login">
                <button className="btn-login">Iniciar sesión</button>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}


// src\components\Navbar.jsx