// src/components/Footer.jsx
import React from "react";
function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <small>
          © {new Date().getFullYear()} roberto3101 • Construido con React ⚛️
        </small>
      </div>
    </footer>
  );
}
export default Footer;