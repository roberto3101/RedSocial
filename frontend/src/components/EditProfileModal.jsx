import { useEffect, useState, useRef } from "react";
import Modal from "react-modal";
import { useProfile } from "../context/ProfileContext";
import { API_BASE, authHeader } from "../lib/apiBase";

Modal.setAppElement("#root");

export default function EditProfileModal({ isOpen, onClose, onSaved }) {
  const { profile, setProfile } = useProfile();
  // Asegúrate de que siempre exista el campo avatar y cv
  const [form, setForm] = useState({ ...profile, avatar: profile?.avatar || "", cv: profile?.cv || "" });
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const cvInputRef = useRef(null);

  useEffect(() => {
    // Siempre crea los campos por si faltan
    setForm({ ...profile, avatar: profile?.avatar || "", cv: profile?.cv || "" });
  }, [profile, isOpen]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const data = new FormData();
      data.append("image", file);
      const res = await fetch(`${API_BASE}/api/upload-image`, {
        method: "POST",
        body: data,
        headers: { ...authHeader() }
      });
      const json = await res.json();
      if (json.url) setForm(f => ({ ...f, avatar: json.url }));
      else alert("No se pudo subir la imagen");
    } catch {
      alert("Error al subir la imagen");
    } finally {
      setUploading(false);
    }
  };

  const handleCVChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      alert("Solo se permite formato PDF para el CV.");
      return;
    }
    setUploading(true);
    try {
      const data = new FormData();
      data.append("image", file);
      const res = await fetch(`${API_BASE}/api/upload-image`, {
        method: "POST",
        body: data,
        headers: { ...authHeader() }
      });
      const json = await res.json();
      if (json.url) setForm(f => ({ ...f, cv: json.url }));
      else alert("No se pudo subir el archivo CV");
    } catch {
      alert("Error al subir el CV");
    } finally {
      setUploading(false);
    }
  };

  const validateWhatsApp = (number) => /^\+\d{7,20}$/.test(number);

  const handleSave = async (e) => {
    e.preventDefault();
    if (form.whatsapp && !validateWhatsApp(form.whatsapp.trim())) {
      alert("El número de WhatsApp debe estar en formato internacional: Ejemplo +51938192665");
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/api/profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeader()
        },
        // Asegura que avatar y cv van siempre en el body
        body: JSON.stringify({ ...form, avatar: form.avatar || "", cv: form.cv || "" })
      });
      if (!res.ok) throw new Error("No se pudo actualizar el perfil");
      const updated = await res.json();
      setProfile(updated);
      if (onSaved) onSaved(updated);
      onClose();
    } catch (err) {
      alert("No se pudo actualizar: " + err.message);
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} className="modal-content-modern" overlayClassName="modal-overlay-modern">
      <h2>Editar Perfil</h2>
      <form onSubmit={handleSave} className="profile-form">
        <label>Nombre
          <input name="firstName" value={form.firstName || ""} onChange={handleChange} required />
        </label>
        <label>Apellido
          <input name="lastName" value={form.lastName || ""} onChange={handleChange} />
        </label>
        <label>Sobre mí
          <textarea name="about" rows={4} value={form.about || ""} onChange={handleChange} />
        </label>
        <label>Lenguajes/Habilidades (separados por coma)
          <input name="languages" value={form.languages || ""} onChange={handleChange} placeholder="React, Node.js, Java, MySQL" />
        </label>
        <label>Años de experiencia
          <input type="number" name="experience" value={form.experience || 0} onChange={handleChange} min={0} />
        </label>
        <label>Líneas de código mantenidas
          <input type="number" name="codeLines" value={form.codeLines || 0} onChange={handleChange} min={0} />
        </label>
        <label>Proyectos deployados
          <input type="number" name="deployed" value={form.deployed || 0} onChange={handleChange} min={0} />
        </label>
        <label>
          Adjuntar foto de perfil (avatar)
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleAvatarChange}
              style={{ maxWidth: 160 }}
              disabled={uploading}
            />
            {uploading && <span>Subiendo...</span>}
            {form.avatar && (
              <img src={form.avatar} alt="avatar" style={{ width: 48, height: 48, borderRadius: "50%" }} />
            )}
          </div>
        </label>
        <label>
          Adjuntar CV (PDF)
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input
              type="file"
              accept="application/pdf"
              ref={cvInputRef}
              onChange={handleCVChange}
              style={{ maxWidth: 220 }}
              disabled={uploading}
            />
            {uploading && <span>Subiendo...</span>}
            {form.cv && (
              <a href={form.cv} target="_blank" rel="noopener noreferrer" style={{ fontSize: 14 }}>
                Ver CV
              </a>
            )}
          </div>
        </label>
        <label>Email de contacto
          <input name="email" type="email" value={form.email || ""} onChange={handleChange} />
        </label>
        <label>
          WhatsApp (formato internacional: +51938192665)
          <input
            name="whatsapp"
            value={form.whatsapp || ""}
            onChange={handleChange}
            placeholder="+1234567890"
            type="tel"
            pattern="^\+\d{7,20}$"
            title="Incluye el símbolo + seguido de código de país y número"
          />
        </label>
        <label>GitHub (URL)
          <input name="github" value={form.github || ""} onChange={handleChange} />
        </label>
        <label>LinkedIn (URL)
          <input name="linkedin" value={form.linkedin || ""} onChange={handleChange} />
        </label>
        <div className="btn-group">
          <button type="submit" className="btn-primary" disabled={uploading}>Guardar</button>
          <button type="button" className="btn-outline" onClick={onClose}>Cancelar</button>
        </div>
      </form>
    </Modal>
  );
}
