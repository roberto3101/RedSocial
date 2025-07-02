// Hero.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './Hero.module.css';

export default function Hero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const words = ['talento', 'proyectos', 'conexiones', 'oportunidades'];

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % words.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className={styles.heroSection}>
      {/* Gradient orbs de fondo */}
      <div className={styles.heroBg}>
        <div 
          className={`${styles.gradientOrb} ${styles.gradientOrb1}`}
          style={{
            transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`
          }}
        />
        <div 
          className={`${styles.gradientOrb} ${styles.gradientOrb2}`}
          style={{
            transform: `translate(${-mousePosition.x}px, ${-mousePosition.y}px)`
          }}
        />
        <div className={styles.gridOverlay} />
      </div>

      {/* Navegación */}
      <nav className={styles.heroNav}>
        <div className={styles.navContainer}>
          <div className={styles.logo}>
            <span className={styles.logoText}>DevConnect</span>
            <span className={styles.logoDot}>.</span>
          </div>
          
          <div className={styles.navLinks}>
            <a href="#features" className={styles.navLink}>Características</a>
            <a href="#profiles" className={styles.navLink}>Desarrolladores</a>
            <a href="#how-it-works" className={styles.navLink}>Cómo funciona</a>
            <Link to="/login" className={`${styles.navLink} ${styles.navLinkLogin}`}>Iniciar sesión</Link>
            <Link to="/register" className={styles.navCta}>
              <span>Comenzar gratis</span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </div>
      </nav>

      {/* Contenido principal */}
      <div className={styles.heroContent}>
        <div className={styles.heroText}>
          <div className={styles.heroBadge}>
            <span className={styles.badgeDot}></span>
            <span>Plataforma #1 para desarrolladores en LATAM</span>
          </div>
          
          <h1 className={styles.heroTitle}>
            Donde el código
            <br />
            encuentra{' '}
            <span className={styles.heroHighlight}>
              <span className={styles.wordCarousel}>
                {words.map((word, index) => (
                  <span
                    key={word}
                    className={`${styles.carouselWord} ${index === currentWordIndex ? styles.active : ''}`}
                  >
                    {word}
                  </span>
                ))}
              </span>
            </span>
          </h1>
          
          <p className={styles.heroDescription}>
            La plataforma donde desarrolladores construyen su reputación
            a través de proyectos reales, contenido técnico y conexiones
            significativas. Tu portafolio cobra vida aquí.
          </p>
          
          <div className={styles.heroActions}>
            <Link to="/register" className={styles.heroCtaPrimary}>
              <span>Crear mi perfil</span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 4V16M16 10H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </Link>
            <Link to="/projects" className={styles.heroCtaSecondary}>
              <span>Explorar proyectos</span>
            </Link>
          </div>
          
          <div className={styles.heroStats}>
            <div className={styles.stat}>
              <span className={styles.statNumber}>500+</span>
              <span className={styles.statLabel}>Desarrolladores activos</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statNumber}>2,000+</span>
              <span className={styles.statLabel}>Proyectos publicados</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statNumber}>10k+</span>
              <span className={styles.statLabel}>Conexiones creadas</span>
            </div>
          </div>
        </div>

        {/* Preview visual */}
        <div className={styles.heroVisual}>
          <div className={styles.visualContainer}>
            <div className={styles.browserMockup}>
              <div className={styles.browserHeader}>
                <div className={styles.browserDots}>
                  <span className={styles.dot}></span>
                  <span className={styles.dot}></span>
                  <span className={styles.dot}></span>
                </div>
                <div className={styles.browserBar}>
                  <span>devconnect.com/profile/maria-dev</span>
                </div>
              </div>
              
              <div className={styles.profilePreview}>
                <div className={styles.previewHeader}>
                  <img 
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Maria" 
                    alt="Profile"
                    className={styles.previewAvatar}
                  />
                  <div className={styles.previewInfo}>
                    <h3>María García</h3>
                    <p>Full Stack Developer</p>
                    <div className={styles.previewTags}>
                      <span className={styles.tag}>React</span>
                      <span className={styles.tag}>Node.js</span>
                      <span className={styles.tag}>PostgreSQL</span>
                    </div>
                  </div>
                </div>
                
                <div className={styles.previewProjects}>
                  <div className={styles.projectCard}>
                    <div className={styles.projectHeader}>
                      <span className={styles.projectIcon}>🚀</span>
                      <span className={styles.projectStatus}>En producción</span>
                    </div>
                    <h4>E-commerce Platform</h4>
                    <p>Sistema completo con pagos integrados</p>
                    <div className={styles.projectFooter}>
                      <span>⭐ 234</span>
                      <span>👁 1.2k views</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating elements */}
            <div className={`${styles.floatingCard} ${styles.floatingCard1}`}>
              <span className={styles.cardIcon}>💬</span>
              <span>Nuevo mensaje de reclutador</span>
            </div>
            
            <div className={`${styles.floatingCard} ${styles.floatingCard2}`}>
              <span className={styles.cardIcon}>🎯</span>
              <span>Match con proyecto</span>
            </div>
            
            <div className={`${styles.floatingCard} ${styles.floatingCard3}`}>
              <span className={styles.cardIcon}>📈</span>
              <span>+150 vistas esta semana</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className={styles.scrollIndicator}>
        <div className={styles.mouse}>
          <div className={styles.wheel}></div>
        </div>
        <span>Desliza para explorar</span>
      </div>
    </section>
  );
}