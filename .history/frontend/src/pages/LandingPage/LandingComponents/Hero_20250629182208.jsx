import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// import rob from "/imagenes/rob.jpg"; // Comenta esto temporalmente
import './Hero.css';

export default function Hero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [runeGlow, setRuneGlow] = useState(0);
  const words = ['guerreros', 'leyendas', 'conquistas', 'destinos'];

  // Debug: diferentes formas de referenciar la imagen
  const getImageSrc = () => {
    const base = import.meta.env.BASE_URL || '/';
    
    // En preview/producción, BASE_URL será "/RedSocial/"
    // En desarrollo será "/"
    console.log('🔧 BASE_URL:', base);
    console.log('🔧 Mode:', import.meta.env.MODE);
    console.log('🔧 DEV:', import.meta.env.DEV);
    
    // Construir ruta manualmente
    const imagePath = `${base}imagenes/rob.jpg`;
    console.log('🖼️ Ruta imagen:', imagePath);
    
    return imagePath;
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 30;
      const y = (e.clientY / window.innerHeight - 0.5) * 30;
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

  useEffect(() => {
    const runeInterval = setInterval(() => {
      setRuneGlow((prev) => (prev + 1) % 3);
    }, 2000);
    return () => clearInterval(runeInterval);
  }, []);

  return (
    <section className="hero-section">
      {/* Resto del código igual... */}
      <div className="hero-bg">
        <div className="rune-layer">
          {['ᚠ', 'ᚱ', 'ᛉ', 'ᚺ', 'ᚨ', 'ᚷ', 'ᛟ', 'ᛞ'].map((rune, i) => (
            <span 
              key={i} 
              className={`floating-rune ${runeGlow === i % 3 ? 'glow' : ''}`}
              style={{
                left: `${10 + i * 12}%`,
                top: `${20 + (i % 2) * 40}%`,
                animationDelay: `${i * 0.5}s`
              }}
            >
              {rune}
            </span>
          ))}
        </div>
        
        <div 
          className="mystic-orb orb-1"
          style={{
            transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`
          }}
        />
        <div 
          className="mystic-orb orb-2"
          style={{
            transform: `translate(${-mousePosition.x * 0.5}px, ${-mousePosition.y * 0.5}px)`
          }}
        />
        
        <div className="energy-particles"></div>
        <div className="mystic-grid"></div>
      </div>

      <nav className="hero-nav">
        <div className="nav-container">
          <div className="logo">
            <div className="logo-rune">⚔</div>
            <span className="logo-text">DevRealm</span>
            <span className="logo-glow">.</span>
          </div>
          
          <div className="nav-links">
            <a href="#features" className="nav-link">
              <span className="link-rune">◈</span>
              Poderes
            </a>
            <a href="#profiles" className="nav-link">
              <span className="link-rune">◈</span>
              Héroes
            </a>
            <a href="#quests" className="nav-link">
              <span className="link-rune">◈</span>
              Misiones
            </a>
            <Link to="/login" className="nav-link nav-link-login">
              <span className="link-rune">⚡</span>
              Portal
            </Link>
            <Link to="/register" className="nav-cta">
              <span className="cta-icon">🔥</span>
              <span>Unirse al Reino</span>
              <div className="cta-aura"></div>
            </Link>
          </div>
        </div>
      </nav>

      <div className="hero-content">
        <div className="hero-text">
          <div className="hero-badge">
            <div className="badge-glow"></div>
            <span className="badge-rune">ᛟ</span>
            <span>Reino #1 de Desarrolladores en LATAM</span>
          </div>
          
          <h1 className="hero-title">
            Aquí es donde el
            <br />
           código se forja.{' '}
            <span className="hero-highlight">
              <span className="word-carousel">
                {words.map((word, index) => (
                  <span
                    key={word}
                    className={`carousel-word ${index === currentWordIndex ? 'active' : ''}`}
                  >
                    {word}
                  </span>
                ))}
              </span>
              <div className="highlight-aura"></div>
            </span>
          </h1>
          
          <p className="hero-description">
            Únete al reino donde desarrolladores épicos construyen su legado
            a través de batallas de código, sabiduría compartida y alianzas
            poderosas. Tu saga comienza aquí.
          </p>
          
          <div className="hero-actions">
              <Link to="/register" className="hero-cta-primary">
              <div className="cta-bg-effect"></div>
              <span className="cta-icon">⚔</span>
              <span>Inicia sesión, únete a nosotros!</span>
              <div className="power-gauge"></div>
            </Link>
            <Link to="/projects" className="hero-cta-secondary">
              <span className="cta-icon">🛡</span>
              <span>Explorar Proyectos</span>
            </Link>
          </div>
          
          <div className="hero-stats">
            <div className="stat">
              <div className="stat-icon">👑</div>
              <span className="stat-number">500+</span>
              <span className="stat-label">Guerreros activos</span>
            </div>
            <div className="stat-divider">
              <div className="divider-rune">◊</div>
            </div>
            <div className="stat">
              <div className="stat-icon">⚔</div>
              <span className="stat-number">2,000+</span>
              <span className="stat-label">Batallas ganadas</span>
            </div>
            <div className="stat-divider">
              <div className="divider-rune">◊</div>
            </div>
            <div className="stat">
              <div className="stat-icon">🔥</div>
              <span className="stat-number">10k+</span>
              <span className="stat-label">Alianzas forjadas</span>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="visual-container">
            <div className="profile-aura"></div>
            
            <Link to="/portafolio" className="profile-card-link">
              <div className="profile-mockup">
                <div className="profile-frame">
                  <div className="frame-corner tl">╔</div>
                  <div className="frame-corner tr">╗</div>
                  <div className="frame-corner bl">╚</div>
                  <div className="frame-corner br">╝</div>
                </div>
                
                <div className="profile-header">
                  <div className="level-badge">
                    <span className="level-text">LVL</span>
                    <span className="level-number">22</span>
                  </div>
                  <div className="power-bar">
                    <div className="power-fill"></div>
                  </div>
                </div>
                
                <div className="profile-content">
                  <div className="avatar-container">
                    <div className="avatar-frame">
                      {/* 🔧 DEBUG: Múltiples intentos de imagen */}
                      <img 
                        src={getImageSrc()}
                        alt="Avatar Roberto"
                        className="profile-avatar"
                        onError={(e) => {
                          console.error('❌ Error cargando imagen:', e.target.src);
                          // Fallback: usar una imagen de placeholder
                          e.target.src = 'https://via.placeholder.com/150/4a2969/ffffff?text=R';
                        }}
                        onLoad={() => {
                          console.log('✅ Imagen cargada correctamente');
                        }}
                      />
                      <div className="avatar-aura"></div>
                    </div>
                    <div className="profile-info">
                      <h3 className="profile-name">Jose Roberto</h3>
                      <p className="profile-class">⚔ Full Stack Berserker</p>
                      <div className="skill-runes">
                        <span className="rune-skill">React</span>
                        <span className="rune-skill">Node.js</span>
                        <span className="rune-skill">MongoDB</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="quest-card">
                    <div className="quest-header">
                      <span className="quest-icon">🗡</span>
                      <span className="quest-status">Misión Épica</span>
                    </div>
                    <h4>Sistema de Batalla PvP</h4>
                    <p>Forjando un coliseo digital para 10k+ guerreros</p>
                    <div className="quest-rewards">
                      <span>⭐ 234 Honor</span>
                      <span>👁 1.2k Testigos</span>
                    </div>
                  </div>

                  <div className="profile-cta">
                    <div className="cta-content">
                      <span className="cta-icon">👁️</span>
                      <span className="cta-text">Ver Portafolio Completo</span>
                      <div className="cta-arrow">→</div>
                    </div>
                    <div className="cta-glow"></div>
                  </div>
                </div>

                <div className="click-indicator">
                  <div className="click-pulse"></div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      <div className="scroll-indicator">
        <div className="scroll-rune">⟱</div>
        <span>Desciende al reino</span>
      </div>
    </section>
  );
}