// ─── src/components/CaveLink.jsx ─────────────────────────
import { Link } from "react-router-dom";

/**
 *  Con “?url” Vite fuerza que el import sea SOLO la ruta/URL del archivo.
 *  Así evitamos que herramientas como SVGR lo transformen en componente
 *  y obtenemos una cadena segura para <img src="…">.
 */
import caveIcon from "../assets/cave-svg.svg?react";

export default function CaveLink() {
  return (
    <Link to="/blog" className="cave-link" aria-label="Ir al blog">
      <img src={caveIcon} alt="Icono de cueva" width={48} height={48} />
    </Link>
  );
}
