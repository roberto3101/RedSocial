import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useProfile } from "../../context/ProfileContext";
import { useAuth } from "../../context/AuthContext";

export default function CreateProfile() {
  const navigate = useNavigate();
  const { profile, setProfile } = useProfile();
  const { token } = useAuth();

  const [avatarUploading, setAvatarUploading] = useState(false);
  const [cvUploading, setCvUploading] = useState(false);
  const [cvUrl, setCvUrl] = useState(profile?.cv || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const [form, setForm] = useState({
    username: "",
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    website: "",
    languages: "",
    interests: "",
    about: "",
    avatar: "",
    cv: "",
  });

  useEffect(() => {
    if (!profile) return;
    setForm({
      username: profile.username || "",
      firstName: profile.firstName || "",
      lastName: profile.lastName || "",
      phone: profile.phone || "",
      email: profile.email || "",
      website: profile.website || "",
      languages: profile.languages || "",
      interests: profile.interests || "",
      about: profile.about || "",
      avatar: profile.avatar || "",
      cv: profile.cv || "",
    });
    if (profile.cv) setCvUrl(profile.cv);
  }, [profile]);

  // Validaciones
  const validateField = (name, value) => {
    const errors = { ...fieldErrors };
    
    switch (name) {
      case 'username':
        if (!value.trim()) {
          errors.username = 'El nombre de usuario es obligatorio';
        } else if (value.length < 3) {
          errors.username = 'El nombre de usuario debe tener al menos 3 caracteres';
        } else if (!/^[a-zA-Z0-9_-]+$/.test(value)) {
          errors.username = 'Solo se permiten letras, números, guiones y guiones bajos';
        } else {
          delete errors.username;
        }
        break;
      
      case 'firstName':
        if (!value.trim()) {
          errors.firstName = 'El nombre es obligatorio';
        } else if (value.length < 2) {
          errors.firstName = 'El nombre debe tener al menos 2 caracteres';
        } else {
          delete errors.firstName;
        }
        break;
      
      case 'lastName':
        if (!value.trim()) {
          errors.lastName = 'Los apellidos son obligatorios';
        } else if (value.length < 2) {
          errors.lastName = 'Los apellidos deben tener al menos 2 caracteres';
        } else {
          delete errors.lastName;
        }
        break;
      
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) {
          errors.email = 'El correo es obligatorio';
        } else if (!emailRegex.test(value)) {
          errors.email = 'Ingresa un correo válido';
        } else {
          delete errors.email;
        }
        break;
      
      case 'phone':
        if (value && !/^[\d\s\-\+\(\)]+$/.test(value)) {
          errors.phone = 'Formato de teléfono inválido';
        } else {
          delete errors.phone;
        }
        break;
      
      case 'website':
        if (value && !value.startsWith('http')) {
          errors.website = 'La URL debe comenzar con http:// o https://';
        } else {
          delete errors.website;
        }
        break;
      
      case 'about':
        if (value && value.length > 500) {
          errors.about = 'La descripción no puede exceder 500 caracteres';
        } else {
          delete errors.about;
        }
        break;
      
      default:
        break;
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateForm = () => {
    const errors = {};
    
    // Avatar obligatorio
    if (!form.avatar) {
      errors.avatar = 'La foto de perfil es obligatoria';
    }
    
    // Campos obligatorios
    if (!form.username.trim()) errors.username = 'El nombre de usuario es obligatorio';
    if (!form.firstName.trim()) errors.firstName = 'El nombre es obligatorio';
    if (!form.lastName.trim()) errors.lastName = 'Los apellidos son obligatorios';
    if (!form.email.trim()) errors.email = 'El correo es obligatorio';
    
    // Validaciones específicas
    if (form.username && form.username.length < 3) {
      errors.username = 'El nombre de usuario debe tener al menos 3 caracteres';
    }
    if (form.username && !/^[a-zA-Z0-9_-]+$/.test(form.username)) {
      errors.username = 'Solo se permiten letras, números, guiones y guiones bajos';
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (form.email && !emailRegex.test(form.email)) {
      errors.email = 'Ingresa un correo válido';
    }
    
    if (form.website && !form.website.startsWith('http')) {
      errors.website = 'La URL debe comenzar con http:// o https://';
    }
    
    if (form.about && form.about.length > 500) {
      errors.about = 'La descripción no puede exceder 500 caracteres';
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Función para validar archivos de imagen
  const validateImageFile = (file) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Solo se permiten archivos JPG, PNG, GIF o WebP');
    }
    
    if (file.size > maxSize) {
      throw new Error('La imagen no puede ser mayor a 5MB');
    }
    
    return true;
  };

  // Subida de avatar mejorada
  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      validateImageFile(file);
      setAvatarUploading(true);
      setError("");
      
      const fd = new FormData();
      fd.append("image", file);
      
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/upload-image`,
        fd,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      
      setForm(f => ({ ...f, avatar: data.url }));
      
      // Limpiar error de avatar si existía
      const newErrors = { ...fieldErrors };
      delete newErrors.avatar;
      setFieldErrors(newErrors);
      
    } catch (err) {
      const errorMsg = err.message || "Error al subir la imagen";
      setError(errorMsg);
      console.error("Error uploading avatar:", err);
    } finally {
      setAvatarUploading(false);
    }
  };

  // Subida de CV mejorada
  const handleCvFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.type !== "application/pdf") {
      setError("Solo se permite formato PDF para el CV");
      return;
    }
    
    const maxSize = 10 * 1024 * 1024; // 10MB para CV
    if (file.size > maxSize) {
      setError("El CV no puede ser mayor a 10MB");
      return;
    }
    
    setCvUploading(true);
    setError("");
    
    try {
      const fd = new FormData();
      fd.append("image", file); // Mantengo "image" porque así lo espera tu backend
      
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/upload-image`,
        fd,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      
      setForm(f => ({ ...f, cv: data.url }));
      setCvUrl(data.url);
      
    } catch (err) {
      setError("Error al subir el CV");
      console.error("Error uploading CV:", err);
    } finally {
      setCvUploading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    
    // Validación en tiempo real
    setTimeout(() => validateField(name, value), 300);
  };

  // Submit mejorado
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!validateForm()) {
      setError("Por favor corrige los errores antes de continuar");
      return;
    }
    
    setLoading(true);

    if (!token) {
      setError("No estás autenticado");
      setLoading(false);
      return;
    }

    try {
      const { data: saved } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/profile`,
        { ...form },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setProfile(saved);

      if (saved.cv) setCvUrl(saved.cv);

      if (saved.username) {
        navigate(`/profile/${saved.username}`);
      } else {
        navigate("/");
      }
    } catch (err) {
      if (err.response?.status === 409) {
        setFieldErrors({ username: "Este nombre de usuario ya está en uso" });
        setError("El nombre de usuario ya está en uso");
      } else {
        setError(
          err.response?.data?.msg ||
          "No se pudo guardar el perfil. Intenta de nuevo."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const getFieldErrorClass = (fieldName) => {
    return fieldErrors[fieldName] ? 'field-error' : '';
  };

  // Render
  return (
    <main className="container create-profile">
      <h1>{profile ? "Editar" : "Completa"} tu perfil</h1>
      <form onSubmit={handleSubmit} className="profile-form">
        {/* AVATAR */}
        <div className={`avatar-field ${getFieldErrorClass('avatar')}`}>
          <label className="avatar-label">
            {form.avatar ? (
              <img src={form.avatar} alt="Avatar" />
            ) : (
              <span className="avatar-placeholder">
                <span className="plus-icon">+</span>
                <span className="upload-text">Subir foto</span>
              </span>
            )}
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
              onChange={handleFile}
              hidden
              disabled={avatarUploading}
            />
          </label>
          <p>
            Foto de perfil <span className="required">*</span>
            {avatarUploading && <span className="loading"> Subiendo...</span>}
          </p>
          {fieldErrors.avatar && (
            <span className="error-message">{fieldErrors.avatar}</span>
          )}
        </div>

        {/* DATOS */}
        <div className="grid two-cols">
          <label className={getFieldErrorClass('firstName')}>
            Nombre(s) <span className="required">*</span>
            <input 
              name="firstName" 
              value={form.firstName} 
              onChange={handleChange}
              placeholder="Tu nombre"
              maxLength="50"
            />
            {fieldErrors.firstName && (
              <span className="error-message">{fieldErrors.firstName}</span>
            )}
          </label>
          <label className={getFieldErrorClass('lastName')}>
            Apellidos <span className="required">*</span>
            <input 
              name="lastName" 
              value={form.lastName} 
              onChange={handleChange}
              placeholder="Tus apellidos"
              maxLength="50"
            />
            {fieldErrors.lastName && (
              <span className="error-message">{fieldErrors.lastName}</span>
            )}
          </label>
        </div>
        
        <label className={getFieldErrorClass('username')}>
          Nombre de usuario <span className="required">*</span>
          <input 
            name="username" 
            value={form.username} 
            onChange={handleChange}
            placeholder="usuario_unico"
            maxLength="30"
          />
          <small className="help-text">
            Solo letras, números, guiones y guiones bajos. Mínimo 3 caracteres.
          </small>
          {fieldErrors.username && (
            <span className="error-message">{fieldErrors.username}</span>
          )}
        </label>
        
        <label className={getFieldErrorClass('email')}>
          Correo <span className="required">*</span>
          <input 
            type="email" 
            name="email" 
            value={form.email} 
            onChange={handleChange}
            placeholder="tu@email.com"
          />
          {fieldErrors.email && (
            <span className="error-message">{fieldErrors.email}</span>
          )}
        </label>
        
        <label className={getFieldErrorClass('phone')}>
          Teléfono
          <input 
            name="phone" 
            value={form.phone} 
            onChange={handleChange}
            placeholder="+51 999 999 999"
            maxLength="20"
          />
          {fieldErrors.phone && (
            <span className="error-message">{fieldErrors.phone}</span>
          )}
        </label>
        
        <label className={getFieldErrorClass('website')}>
          Sitio web
          <input 
            name="website" 
            value={form.website} 
            onChange={handleChange}
            placeholder="https://tusitio.com"
          />
          {fieldErrors.website && (
            <span className="error-message">{fieldErrors.website}</span>
          )}
        </label>
        
        <label>
          Idiomas
          <input 
            name="languages" 
            value={form.languages} 
            onChange={handleChange}
            placeholder="Español, Inglés, Portugués..."
            maxLength="200"
          />
        </label>
        
        <label>
          Intereses - áreas en las que deseas desarrollarte
          <input 
            name="interests" 
            value={form.interests} 
            onChange={handleChange}
            placeholder="Frontend, IA, DevOps, Diseño UX..."
            maxLength="200"
          />
        </label>
        
        <label className={getFieldErrorClass('about')}>
          Sobre mí
          <textarea 
            name="about" 
            rows={4} 
            value={form.about} 
            onChange={handleChange}
            placeholder="Cuéntanos sobre ti, tu experiencia, objetivos..."
            maxLength="500"
          />
          <small className="help-text">
            {form.about.length}/500 caracteres
          </small>
          {fieldErrors.about && (
            <span className="error-message">{fieldErrors.about}</span>
          )}
        </label>

        {/* Campo subir CV */}
        <label>
          Adjuntar CV (PDF)
          <input 
            type="file" 
            accept="application/pdf" 
            onChange={handleCvFile} 
            disabled={cvUploading} 
          />
          {cvUploading && <span className="loading"> Subiendo...</span>}
          {form.cv && (
            <div className="cv-preview">
              <a href={form.cv} target="_blank" rel="noopener noreferrer">
                📄 Ver CV actual
              </a>
            </div>
          )}
          <small className="help-text">
            Formato PDF, máximo 10MB
          </small>
        </label>

        {error && <div className="form-error">{error}</div>}

        <button 
          className="btn-login wide" 
          disabled={loading || avatarUploading || cvUploading}
          type="submit"
        >
          {loading ? "Guardando..." : "Guardar perfil"}
        </button>
      </form>
      
      <style jsx>{`
        .profile-form {
          max-width: 600px;
          margin: 0 auto;
        }
        
        .avatar-field {
          text-align: center;
          margin-bottom: 2rem;
        }
        
        .avatar-label {
          display: inline-block;
          cursor: pointer;
          border-radius: 50%;
          overflow: hidden;
          width: 120px;
          height: 120px;
          border: 3px dashed #ddd;
          transition: border-color 0.3s;
        }
        
        .avatar-label:hover {
          border-color: #007bff;
        }
        
        .avatar-label img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .avatar-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: #666;
        }
        
        .plus-icon {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }
        
        .upload-text {
          font-size: 0.8rem;
        }
        
        .grid.two-cols {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        
        .required {
          color: #e74c3c;
        }
        
        .field-error {
          border-color: #e74c3c !important;
        }
        
        .field-error input,
        .field-error textarea {
          border-color: #e74c3c;
        }
        
        .error-message {
          color: #e74c3c;
          font-size: 0.85rem;
          display: block;
          margin-top: 0.25rem;
        }
        
        .help-text {
          color: #666;
          font-size: 0.85rem;
          display: block;
          margin-top: 0.25rem;
        }
        
        .loading {
          color: #007bff;
          font-weight: 500;
        }
        
        .form-error {
          background-color: #f8d7da;
          color: #721c24;
          padding: 0.75rem;
          border-radius: 4px;
          margin: 1rem 0;
          border: 1px solid #f5c6cb;
        }
        
        .cv-preview {
          margin-top: 0.5rem;
          padding: 0.5rem;
          background-color: #f8f9fa;
          border-radius: 4px;
        }
        
        .cv-preview a {
          color: #007bff;
          text-decoration: none;
        }
        
        .cv-preview a:hover {
          text-decoration: underline;
        }
        
        @media (max-width: 768px) {
          .grid.two-cols {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}