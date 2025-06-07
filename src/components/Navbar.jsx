// src/components/Navbar.jsx
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useProfile } from "../context/ProfileContext";

export default function Navbar({ profile: profileProp }) {
  const [open, setOpen] = useState(false);
  const [logged, setLogged] = useState(() => !!localStorage.getItem("jwt"));
  const location = useLocation();
  const navigate = useNavigate();
  const { setProfile } = useProfile();
  // 👇 Usa prop si la hay, si no, contexto
  const profile = profileProp || useProfile().profile;

  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
    return () => document.body.classList.remove("menu-open");
  }, [open]);

  useEffect(() => setOpen(false), [location.pathname]);
  useEffect(() => {
    const onStorage = () => setLogged(!!localStorage.getItem("jwt"));
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    setProfile(null);
    setLogged(false);
    navigate("/");
  };

  return (
    <header className="navbar">
      <div className="container nav-content">
        <Link to="/" className="logo" onClick={() => setOpen(false)}>
          el blog de <span>{profile?.username || "roberto3101"}</span>
        </Link>
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
            {logged ? (
              <li>
                <button className="btn-login" onClick={handleLogout}>
                  Cerrar sesión
                </button>
              </li>
            ) : (
              <li>
                <Link to="/login">
                  <button className="btn-login">Iniciar sesión</button>
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}
