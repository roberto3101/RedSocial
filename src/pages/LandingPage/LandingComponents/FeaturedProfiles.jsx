import { useState } from 'react';
import './FeaturedProfiles.css';

export default function FeaturedProfiles() {
  const [hoveredProfile, setHoveredProfile] = useState(null);

  const profiles = [
    {
      id: 1,
      name: "Ana Rodriguez",
      role: "Full Stack Developer",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ana",
      stack: ["React", "Node.js", "PostgreSQL"],
      project: {
        title: "E-commerce Platform",
        description: "Sistema completo de comercio electrónico con pagos integrados",
        image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=200&fit=crop",
        metrics: { users: "10k+", sales: "$2M+" }
      },
      post: "Optimizando queries SQL: Reducí tiempo de carga 70% con índices compuestos",
      activity: 95,
      location: "Ciudad de México"
    },
    {
      id: 2,
      name: "Carlos Mendez",
      role: "Mobile Engineer",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos",
      stack: ["React Native", "Swift", "Firebase"],
      project: {
        title: "Fintech App",
        description: "App móvil para transferencias y gestión financiera personal",
        image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&h=200&fit=crop",
        metrics: { downloads: "50k+", rating: "4.8★" }
      },
      post: "Performance en React Native: 5 técnicas para apps ultra-rápidas",
      activity: 88,
      location: "Bogotá"
    },
    {
      id: 3,
      name: "Sofia Chen",
      role: "DevOps Engineer",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sofia",
      stack: ["AWS", "Docker", "Kubernetes"],
      project: {
        title: "Cloud Infrastructure",
        description: "Arquitectura serverless escalable para 1M+ usuarios",
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=200&fit=crop",
        metrics: { uptime: "99.9%", cost: "-60%" }
      },
      post: "Kubernetes vs Docker Swarm: Comparativa real con métricas de producción",
      activity: 92,
      location: "Lima"
    }
  ];

  return (
    <section className="featured-section">
      <div className="featured-container">
        <div className="section-header">
          <div className="header-badge">
            <span className="badge-icon">⭐</span>
            <span>Talentos Destacados</span>
          </div>
          <h2 className="section-title">
            Desarrolladores que están
            <span className="title-highlight"> transformando la industria</span>
          </h2>
          <p className="section-subtitle">
            Descubre perfiles de desarrolladores que han construido su reputación 
            a través de proyectos reales y contenido técnico de calidad.
          </p>
        </div>

        <div className="profiles-grid">
          {profiles.map((profile) => (
            <div 
              key={profile.id}
              className="profile-card"
              onMouseEnter={() => setHoveredProfile(profile.id)}
              onMouseLeave={() => setHoveredProfile(null)}
            >
              <div className="profile-header">
                <div className="avatar-section">
                  <img src={profile.avatar} alt={profile.name} className="profile-avatar" />
                  <div className="status-indicator"></div>
                </div>
                <div className="profile-info">
                  <h3 className="profile-name">{profile.name}</h3>
                  <p className="profile-role">{profile.role}</p>
                  <span className="profile-location">📍 {profile.location}</span>
                </div>
                <div className="activity-score">
                  <div className="activity-ring">
                    <svg viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="16" fill="none" stroke="#1f2937" strokeWidth="2"/>
                      <circle 
                        cx="18" cy="18" r="16" fill="none" 
                        stroke="#14e956" strokeWidth="2"
                        strokeDasharray={`${profile.activity}, 100`}
                        transform="rotate(-90 18 18)"
                      />
                    </svg>
                    <span className="activity-number">{profile.activity}</span>
                  </div>
                </div>
              </div>

              <div className="tech-stack">
                {profile.stack.map((tech) => (
                  <span key={tech} className="tech-badge">{tech}</span>
                ))}
              </div>

              <div className="project-showcase">
                <div className="project-image">
                  <img src={profile.project.image} alt={profile.project.title} />
                  <div className="project-overlay">
                    <span className="view-project">Ver Proyecto</span>
                  </div>
                </div>
                <div className="project-info">
                  <h4 className="project-title">{profile.project.title}</h4>
                  <p className="project-description">{profile.project.description}</p>
                  <div className="project-metrics">
                    {Object.entries(profile.project.metrics).map(([key, value]) => (
                      <div key={key} className="metric">
                        <span className="metric-value">{value}</span>
                        <span className="metric-label">{key}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="latest-post">
                <div className="post-icon">💡</div>
                <p className="post-snippet">"{profile.post}"</p>
                <button className="read-more">Leer más</button>
              </div>

              <div className="profile-actions">
                <button className="action-btn primary">Conectar</button>
                <button className="action-btn secondary">Ver Perfil</button>
              </div>
            </div>
          ))}
        </div>

        <div className="section-footer">
          <button className="explore-all-btn">
            <span>Explorar todos los perfiles</span>
            <span className="btn-arrow">→</span>
          </button>
        </div>
      </div>
    </section>
  );
}