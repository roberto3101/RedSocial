

export default function Footer() {
  return (
    <footer className="footer-section">
      <div className="footer-container">
        {/* Logo y descripción */}
        <div className="footer-brand">
          <div className="footer-logo">
            <div className="footer-logo-rune">⚔</div>
            <span className="footer-logo-text">DevRealm</span>
            <span className="footer-logo-glow">.</span>
          </div>
          <p className="footer-description">
            Forjado por desarrolladores, para desarrolladores
          </p>
        </div>

        {/* Links */}
        <div className="footer-links">
          <div className="footer-column">
            <h4>Legal</h4>
            <a href="/privacy">Privacidad</a>
            <a href="/terms">Términos</a>
            <a href="/cookies">Cookies</a>
          </div>
          <div className="footer-column">
            <h4>Contacto</h4>
            <a href="/contact">Soporte</a>
            <a href="/about">Acerca de</a>
            <a href="/careers">Careers</a>
          </div>
          <div className="footer-column">
            <h4>Síguenos</h4>
            <a href="https://github.com" className="social-link">
              <span className="social-icon">⚡</span>
              GitHub
            </a>
            <a href="https://twitter.com" className="social-link">
              <span className="social-icon">🐦</span>
              Twitter
            </a>
            <a href="https://linkedin.com" className="social-link">
              <span className="social-icon">💼</span>
              LinkedIn
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="footer-bottom">
        <div className="footer-container">
          <p className="footer-copyright">
            © 2024 DevRealm - Hecho con{' '}
            <span className="footer-heart">⚔</span>
            {' '}por desarrolladores épicos
          </p>
        </div>
      </div>
    </footer>
  );
}