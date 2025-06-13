import React, { useRef, useState } from "react";
import { useProfile } from "../context/ProfileContext";

// Datos demo (sin cambios)
const DEMO_PROFILE = {
  firstName: "Roberto",
  lastName: "Demo",
  email: "demo@email.com",
  whatsapp: "+51938192665",
  github: "roberto3101",
  linkedin: "https://www.linkedin.com/in/jos%C3%A9-larosa-ledezma-98b144338/",
};

export default function Contact({ profile: profileProp }) {
  const { profile, loading } = useProfile();

  /* 🩹 Las llamadas a hooks DEBEN ser invariables entre renders
     ─────────────────────────────────────────────────────────
     Colocamos useRef y useState **antes** de cualquier return
     condicional para respetar el orden de hooks y eliminar
     la advertencia de React.                                */
  const formRef = useRef(null);
  const [sending, setSending] = useState(false);

  // Si está cargando, muestra un spinner o nada
  if (loading) return null;

  // PRIORIDAD: prop > contexto > demo
  const mergedProfile = profileProp || profile || DEMO_PROFILE;

  /* ——— Envío de formulario ——— */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    const url = "https://formsubmit.co/ajax/jose0686534@gmail.com";
    const formData = new FormData(formRef.current);

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData,
      });
      if (res.ok) {
        alert(
          "✅ Mensaje enviado.\nPronto el desarrollador se pondrá en contacto contigo."
        );
        formRef.current.reset();
      } else {
        alert("⚠️ No se pudo enviar. Intenta de nuevo.");
      }
    } catch {
      alert("⚠️ Error de red. Revisa tu conexión.");
    } finally {
      setSending(false);
    }
  };

  /* ——— URLs robustas ——— */
  const whatsappUrl = mergedProfile?.whatsapp
    ? `https://wa.me/${mergedProfile.whatsapp.replace(/[^\d]/g, "")}`
    : "#";
  const githubUrl = mergedProfile?.github
    ? mergedProfile.github.startsWith("http")
      ? mergedProfile.github
      : `https://github.com/${mergedProfile.github.replace(/^@/, "")}`
    : "#";
  const linkedinUrl = mergedProfile?.linkedin
    ? mergedProfile.linkedin.startsWith("http")
      ? mergedProfile.linkedin
      : `https://linkedin.com/in/${mergedProfile.linkedin.replace(/^@/, "")}`
    : "#";

  /* ——— UI ——— */
  return (
    <section id="contact" className="contact-section">
      <div className="container contact-wrapper">
        <h2 className="contact-title">¡Ponte en contacto!</h2>
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="contact-form"
          autoComplete="off"
        >
          <input type="text" name="_gotcha" style={{ display: "none" }} />
          <div className="field">
            <label>Nombre completo</label>
            <input
              type="text"
              name="name"
              required
              defaultValue={
                (mergedProfile?.firstName || "") +
                " " +
                (mergedProfile?.lastName || "")
              }
            />
          </div>
          <div className="field">
            <label>Correo electrónico</label>
            <input
              type="email"
              name="email"
              required
              defaultValue={mergedProfile?.email || ""}
            />
          </div>
          <div className="field">
            <label>Mensaje</label>
            <textarea name="message" rows="6" required />
          </div>
          <button type="submit" className="btn-cta full" disabled={sending}>
            {sending ? "Enviando…" : "Enviar mensaje"}
          </button>
        </form>
        <div className="social-links">
          <a
            href={whatsappUrl}
            className="social-btn whatsapp"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
          />
          <a
            href={githubUrl}
            className="social-btn github"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
          />
          <a
            href={linkedinUrl}
            className="social-btn linkedin"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          />
        </div>
      </div>
    </section>
  );
}
// Este componente Contact permite a los usuarios enviar mensajes y contactar al propietario del perfil.
// Utiliza un formulario simple y enlaces a redes sociales para facilitar la comunicación.