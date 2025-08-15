// src/components/Footer.jsx
import React from "react";
import DangerWipeAllButton from "./DangerWipeAllButton"; // Ajusta la ruta si tu carpeta cambia

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <small>
          © {new Date().getFullYear()} roberto3101 • Construido con React ⚛️
        </small>
        <DangerWipeAllButton />
      </div>
    </footer>
  );
}
      </div>
    </footer>
  );
}
export default Footer;