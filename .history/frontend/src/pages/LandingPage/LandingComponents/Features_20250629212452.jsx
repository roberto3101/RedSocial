import { useState } from 'react';
import './Features.css';

export default function Features() {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      id: 0,
      icon: "⚔",
      title: "Portafolio que Habla por Ti",
      subtitle: "Muestra tu poder real",
      description: "Exhibe proyectos reales con código en vivo, métricas de impacto y demostraciones interactivas. Tu trabajo habla más que mil palabras.",
      highlights: [
        "Proyectos con código en vivo",
        "Métricas de rendimiento reales",
        "Demos interactivas",
        "Stack tecnológico detallado"
      ],
      mockup: {
        type: "portfolio",
        preview: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=600&h=400&fit=crop"
      },
      stats: [
        { label: "Visibilidad", value: "+300%" },
        { label: "Ofertas", value: "5x más" }
      ]
    },
    {
      id: 1,
      icon: "🛡",
      title: "Blog Técnico Integrado",
      subtitle: "Forja tu reputación",
      description: "Comparte conocimiento técnico, tutoriales y insights. Construye tu marca personal mientras ayudas a la comunidad developer.",
      highlights: [
        "Editor markdown avanzado",
        "SEO optimizado automático",
        "Análisis de engagement",
        "Integración con redes sociales"
      ],
      mockup: {
        type: "blog",
        preview: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600&h=400&fit=crop"
      },
      stats: [
        { label: "Autoridad", value: "+250%" },
        { label: "Alcance", value: "10x más" }
      ]
    },
    {
      id: 2,
      icon: "👑",
      title: "Networking Estratégico",
      subtitle: "Alianzas poderosas",
      description: "Conecta directamente con reclutadores, founders y otros developers. Chat en tiempo real y colaboración en proyectos épicos.",
      highlights: [
        "Chat directo integrado",
        "Matching inteligente",
        "Colaboración en proyectos",
        "Eventos y meetups"
      ],
      mockup: {
        type: "network",
        preview: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop"
      },
      stats: [
        { label: "Conexiones", value: "+400%" },
        { label: "Oportunidades", value: "8x más" }
      ]
    }
  ];

  return (
    <section className="features-section">
      {/* Fondo místico */}
      <div className="features-bg">
        <div className="feature-orbs">
          <div className="feature-orb orb-left"></div>
          <div className="feature-orb orb-right"></div>
        </div>
        <div className="power-grid"></div>
      </div>

      <div className="features-container">
        {/* Header */}
        <div className="features-header">
          <div className="header-badge">
            <span className="badge-rune">◈</span>
            <span>Poderes Legendarios</span>
            <div className="badge-aura"></div>
          </div>
          
          <h2 className="features-title">
            Tres pilares para
            <br />
            <span className="title-highlight">dominar tu carrera tech</span>
          </h2>
          
          <p className="features-subtitle">
            Cada herramienta está diseñada para maximizar tu impacto profesional.
            No es solo un perfil, es tu arma secreta en el mundo developer.
          </p>
        </div>

        {/* Features Grid */}
        <div className="features-grid">
          {/* Features Navigation */}
          <div className="features-nav">
            {features.map((feature, index) => (
              <div 
                key={feature.id}
                className={`feature-nav-item ${activeFeature === index ? 'active' : ''}`}
                onClick={() => setActiveFeature(index)}
              >
                <div className="nav-icon">
                  <span className="icon-symbol">{feature.icon}</span>
                  <div className="icon-aura"></div>
                </div>
                <div className="nav-content">
                  <h3 className="nav-title">{feature.title}</h3>
                  <p className="nav-subtitle">{feature.subtitle}</p>
                </div>
                <div className="nav-indicator">
                  <div className="indicator-rune">›</div>
                </div>
              </div>
            ))}
          </div>

          {/* Active Feature Display */}
          <div className="feature-display">
            <div className="feature-content">
              <div className="feature-info">
                <div className="feature-icon-large">
                  <span>{features[activeFeature].icon}</span>
                  <div className="large-icon-aura"></div>
                </div>
                
                <h3 className="feature-title-large">
                  {features[activeFeature].title}
                </h3>
                
                <p className="feature-description">
                  {features[activeFeature].description}
                </p>

                <div className="feature-highlights">
                  {features[activeFeature].highlights.map((highlight, index) => (
                    <div key={index} className="highlight-item">
                      <div className="highlight-check">✓</div>
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>

                <div className="feature-stats">
                  {features[activeFeature].stats.map((stat, index) => (
                    <div key={index} className="stat-item">
                      <span className="stat-value">{stat.value}</span>
                      <span className="stat-label">{stat.label}</span>
                    </div>
                  ))}
                </div>

                <a href="/portafolio" className="feature-cta">
                  <span className="cta-icon">🔥</span>
                  <span>Ver mi Portafolio</span>
                  <div className="cta-energy"></div>
                </a>
              </div>

              <div className="feature-visual">
                <div className="visual-frame">
                  {/* Mockup dinámico basado en el feature activo */}
                  <div className="mockup-container">
                    <div className="mockup-header">
                      <div className="mockup-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                      <div className="mockup-title">DevRealm.dev</div>
                    </div>
                    
                    <div className="mockup-content">
                      {activeFeature === 0 && (
                        <div className="portfolio-mockup">
                          <div className="project-card-mini">
                            <img src={features[0].mockup.preview} alt="Portfolio Project" />
                            <div className="project-overlay-mini">
                              <div className="tech-stack-mini">
                                <span>React</span>
                                <span>Node.js</span>
                                <span>AWS</span>
                              </div>
                              <div className="project-metrics-mini">
                                <span>🚀 Live Demo</span>
                                <span>⭐ 234 stars</span>
                              </div>
                            </div>
                          </div>
                          <div className="portfolio-stats">
                            <div className="stat">10k+ views</div>
                            <div className="stat">50+ offers</div>
                          </div>
                        </div>
                      )}

                      {activeFeature === 1 && (
                        <div className="blog-mockup">
                          <div className="blog-post-mini">
                            <h4>Optimizando React: Técnicas Avanzadas</h4>
                            <p>Las mejores prácticas para aplicaciones de alto rendimiento...</p>
                            <div className="post-stats">
                              <span>👁 2.5k views</span>
                              <span>💬 45 comments</span>
                              <span>🔥 128 likes</span>
                            </div>
                          </div>
                          <div className="trending-indicator">📈 Trending #1</div>
                        </div>
                      )}

                      {activeFeature === 2 && (
                        <div className="network-mockup">
                          <div className="chat-preview">
                            <div className="chat-message">
                              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=recruiter" alt="Recruiter" />
                              <div className="message">
                                <p>Hola! Vi tu proyecto de IA. ¿Disponible para una oportunidad senior?</p>
                                <span>Hace 2 min</span>
                              </div>
                            </div>
                          </div>
                          <div className="network-stats">
                            <span>🔗 25 conexiones nuevas</span>
                            <span>💼 8 ofertas activas</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Partículas de energía alrededor del mockup */}
                  <div className="mockup-particles">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className={`particle particle-${i + 1}`}></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action Final */}
        <div className="features-cta-section">
          <div className="cta-card">
            <div className="cta-content">
              <h3 className="cta-title">
                ¿Listo para forjar tu leyenda?
              </h3>
              <p className="cta-description">
                Únete a la élite de developers que han transformado su carrera con DevRealm
              </p>
              <div className="cta-buttons">
                <a href="/register" className="cta-primary">
                  <span className="cta-icon">⚔</span>
                  <span>Comenza</span>
                  <div className="button-energy"></div>
                </a>
                <a href="/" className="cta-secondary">
                  <span className="cta-icon">👁</span>
                  <span>Ver Demo</span>
                </a>
              </div>
            </div>
            <div className="cta-visual">
              <div className="success-stories">
                <div className="story-item">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=success1" alt="Success" />
                  <span>+$50k salary</span>
                </div>
                <div className="story-item">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=success2" alt="Success" />
                  <span>Remote job</span>
                </div>
                <div className="story-item">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=success3" alt="Success" />
                  <span>Tech lead</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}