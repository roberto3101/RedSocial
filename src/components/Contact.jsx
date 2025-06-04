import React, { useRef, useState } from "react";

export default function Contact() {
  const formRef = useRef(null);
  const [sending, setSending] = useState(false);

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
          {/* honeypot anti-bots */}
          <input type="text" name="_gotcha" style={{ display: "none" }} />

          <div className="field">
            <label>Nombre completo</label>
            <input type="text" name="name" required />
          </div>

          <div className="field">
            <label>Correo electrónico</label>
            <input type="email" name="email" required />
          </div>

          <div className="field">
            <label>Mensaje</label>
            <textarea name="message" rows="6" required />
          </div>

          <button type="submit" className="btn-cta full" disabled={sending}>
            {sending ? "Enviando…" : "Enviar mensaje"}
          </button>
        </form>

        {/* enlaces sociales */}
        <div className="social-links">
          <a
            href="https://wa.me/51938192665"
            className="social-btn whatsapp"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
          />
          <a
            href="https://github.com/roberto3101"
            className="social-btn github"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
          />
          <a
            href="https://www.linkedin.com/in/jos%C3%A9-larosa-ledezma-98b144338/"
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
