export default function Footer() {
  const styles = {
    footer: {
      background: 'linear-gradient(180deg, #161b22 0%, #0d1117 100%)',
      borderTop: '1px solid rgba(20, 233, 86, 0.1)',
      padding: '3rem 0 0 0',
      position: 'relative',
      color: '#e6edf3'
    },
    footerBefore: {
      content: "''",
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '1px',
      background: 'linear-gradient(90deg, transparent, #14e956, transparent)'
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 2rem',
      display: 'grid',
      gridTemplateColumns: '1fr 2fr',
      gap: '3rem',
      alignItems: 'start'
    },
    brand: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem'
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      fontSize: '1.25rem',
      fontWeight: 800,
      fontFamily: "'Cinzel', serif",
      color: '#e6edf3'
    },
    logoRune: {
      fontSize: '1.5rem',
      color: '#14e956',
      animation: 'footerPulse 3s ease-in-out infinite'
    },
    logoText: {
      background: 'linear-gradient(135deg, #e6edf3 0%, #58a6ff 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent'
    },
    logoGlow: {
      color: '#14e956',
      textShadow: '0 0 10px currentColor'
    },
    description: {
      color: 'rgba(230, 237, 243, 0.6)',
      fontSize: '0.95rem',
      lineHeight: 1.5,
      margin: 0,
      fontStyle: 'italic'
    },
    links: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '2rem'
    },
    columnTitle: {
      color: '#14e956',
      fontSize: '0.875rem',
      fontWeight: 700,
      margin: '0 0 1rem 0',
      textTransform: 'uppercase',
      letterSpacing: '1px'
    },
    link: {
      display: 'block',
      color: 'rgba(230, 237, 243, 0.7)',
      textDecoration: 'none',
      fontSize: '0.875rem',
      marginBottom: '0.75rem',
      transition: 'all 0.3s ease'
    },
    socialLink: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      color: 'rgba(230, 237, 243, 0.7)',
      textDecoration: 'none',
      fontSize: '0.875rem',
      marginBottom: '0.75rem',
      transition: 'all 0.3s ease'
    },
    socialIcon: {
      fontSize: '1rem',
      transition: 'transform 0.3s ease'
    },
    bottom: {
      marginTop: '2rem',
      padding: '1.5rem 0',
      borderTop: '1px solid rgba(48, 54, 61, 0.5)',
      background: 'rgba(13, 17, 23, 0.5)'
    },
    copyright: {
      textAlign: 'center',
      color: 'rgba(230, 237, 243, 0.5)',
      fontSize: '0.875rem',
      margin: 0
    },
    heart: {
      color: '#14e956',
      animation: 'heartBeat 2s ease-in-out infinite'
    }
  };

  return (
    <>
      <style>
        {`
          @keyframes footerPulse {
            0%, 100% { opacity: 0.8; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.05); }
          }
          @keyframes heartBeat {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
          }
          .footer-link:hover {
            color: #58a6ff !important;
            transform: translateX(5px);
          }
          .footer-social:hover .footer-social-icon {
            transform: scale(1.2);
          }
          @media (max-width: 768px) {
            .footer-container {
              grid-template-columns: 1fr !important;
              gap: 2rem !important;
              padding: 0 1rem !important;
            }
            .footer-links {
              grid-template-columns: 1fr !important;
              gap: 1.5rem !important;
            }
            .footer-section {
              padding: 2rem 0 0 0 !important;
            }
          }
          @media (max-width: 480px) {
            .footer-logo {
              justify-content: center !important;
            }
            .footer-description {
              text-align: center !important;
            }
            .footer-column {
              text-align: center !important;
            }
          }
        `}
      </style>
      <footer style={styles.footer} className="footer-section">
        <div style={styles.container} className="footer-container">
          {/* Logo y descripción */}
          <div style={styles.brand} className="footer-brand">
            <div style={styles.logo} className="footer-logo">
              <div style={styles.logoRune}>⚔</div>
              <span style={styles.logoText}>DevRealm</span>
              <span style={styles.logoGlow}>.</span>
            </div>
            <p style={styles.description} className="footer-description">
              Forjado por desarrolladores, para desarrolladores
            </p>
          </div>

          {/* Links */}
          <div style={styles.links} className="footer-links">
            <div className="footer-column">
              <h4 style={styles.columnTitle}>Legal</h4>
              <a href="/privacy" style={styles.link} className="footer-link">Privacidad</a>
              <a href="/terms" style={styles.link} className="footer-link">Términos</a>
              <a href="/cookies" style={styles.link} className="footer-link">Cookies</a>
            </div>
            <div className="footer-column">
              <h4 style={styles.columnTitle}>Contacto</h4>
              <a href="/contact" style={styles.link} className="footer-link">Soporte</a>
              <a href="/about" style={styles.link} className="footer-link">Acerca de</a>
              <a href="/careers" style={styles.link} className="footer-link">Careers</a>
            </div>
            <div className="footer-column">
              <h4 style={styles.columnTitle}>Síguenos</h4>
              <a href="https://github.com" style={styles.socialLink} className="footer-social">
                <span style={styles.socialIcon} className="footer-social-icon">⚡</span>
                GitHub
              </a>
              <a href="https://twitter.com" style={styles.socialLink} className="footer-social">
                <span style={styles.socialIcon} className="footer-social-icon">🐦</span>
                Twitter
              </a>
              <a href="https://linkedin.com" style={styles.socialLink} className="footer-social">
                <span style={styles.socialIcon} className="footer-social-icon">💼</span>
                LinkedIn
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div style={styles.bottom}>
          <div style={styles.container}>
            <p style={styles.copyright}>
              © 2024 DevRealm - Hecho con{' '}
              <span style={styles.heart}>⚔</span>
              {' '}por desarrolladores épicos
            </p>
          </div>
        </div>
      </footer>
    </>
  );