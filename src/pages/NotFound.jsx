// src/pages/NotFound.jsx
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="container" style={{ padding: "6rem 0", textAlign: "center" }}>
      <h1>404</h1>
      <p>Página no encontrada.</p>
      <Link className="btn-cta" to="/">Volver al inicio</Link>
    </main>
  );
}
