import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useProfile } from "../context/ProfileContext";
import SearchDropDown from "./SearchDropDown";
import axios from "axios";
import { API_BASE } from "../lib/apiBase"; // ← Importante

export default function Navbar({ profile: profileProp }) {
  const [open, setOpen] = useState(false);
  const [logged, setLogged] = useState(() => !!localStorage.getItem("jwt"));
  const location = useLocation();
  const navigate = useNavigate();
  const { setProfile } = useProfile();
  const profile = profileProp || useProfile().profile;

  // Buscador
  const [query, setQuery] = useState("");
  const [type, setType] = useState("users");
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const timeoutRef = useRef();

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

  // --- Lógica de búsqueda, revisa bien este useEffect ---
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setShowDropdown(false);
      return;
    }
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(async () => {
      try {
        const url = `${API_BASE}/api/search?type=${type}&q=${encodeURIComponent(query)}`;
        const { data } = await axios.get(url);
        setResults(Array.isArray(data) ? data : []);
        setShowDropdown(true);
      } catch (err) {
        setResults([]);
        setShowDropdown(false);
      }
    }, 250);
    return () => clearTimeout(timeoutRef.current);
  }, [query, type]);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <header className="navbar">
      <div className="container nav-content">
        <Link to="/" className="logo" onClick={() => setOpen(false)}>
          el blog de <span>{profile?.username || "roberto3101"}</span>
        </Link>
        <div className="searchbar-container" ref={dropdownRef}>
          <div className="searchbar">
            <input
              type="text"
              placeholder={`Buscar ${type === "users" ? "usuarios" : "posts"}...`}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setShowDropdown(results.length > 0)}
            />
          /*  <select value={type} onChange={(e) => setType(e.target.value)}>
             /* <option value="users">Usuarios</option>
              <option value="posts">Posts</option>
            </select>
          </div>
          {showDropdown && (
            <SearchDropDown
              results={results}
              type={type}
              onClose={() => setShowDropdown(false)}
            />
          )}
        </div>
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
            <li>
              <Link to={profile?.username ? `/projects/${profile.username}` : "/projects"}>
                Proyectos
              </Link>
            </li>
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