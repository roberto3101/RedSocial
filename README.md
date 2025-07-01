# 🚀 RedSocial-Portfolio

**RedSocial-Portfolio** es una plataforma web moderna que combina lo mejor de una red social (feed, perfiles, posts, conexiones) con las funcionalidades de un portafolio profesional interactivo.

- 👤 Perfiles personalizados y públicos
- 📝 Publicación de posts y artículos
- 📡 Feed dinámico (últimas publicaciones de amigos y seguidos)
- 🖼️ Carga de imágenes y avatars
- 🔒 Autenticación JWT y social login (Google, Facebook, GitHub)
- 💬 Chat en tiempo real (WebSocket)
- 📑 Página landing pública con perfiles destacados

## Demo

- **Frontend (GitHub Pages):**  
  [https://roberto3101.github.io/RedSocial/](https://roberto3101.github.io/RedSocial/)
- **Backend (AWS Elastic Beanstalk):**  
  [http://redsocial-api.eba-33ex33fi.us-east-1.elasticbeanstalk.com/](http://redsocial-api.eba-33ex33fi.us-east-1.elasticbeanstalk.com/)

---

## 🛠️ Tecnologías principales

- **Frontend:** React + Vite
- **Backend:** Node.js (Express)
- **Realtime:** Socket.io
- **Autenticación:** JWT + Passport + OAuth
- **Persistencia:** Archivos JSON (user/profiles/posts)
- **Despliegue:** AWS Elastic Beanstalk (API), GitHub Pages (Frontend)
- **Otros:** CloudFront, Multer, Gmail App Password para emails

---

## 📦 Instalación local

### 1. Clona el repositorio

```bash
git clone https://github.com/roberto3101/RedSocial.git
cd RedSocial
2. Instala dependencias
Backend
bash
Copiar
Editar
cd backend
npm install
Frontend
bash
Copiar
Editar
cd ../frontend
npm install
3. Configura variables de entorno
Copia .env.example a .env en ambos /backend y /frontend

Edita las claves necesarias (consultar archivos ejemplo)

4. Inicia los servidores
Backend (Puerto 3001 por defecto)
bash
Copiar
Editar
npm start
Frontend (Vite, puerto 5173 por defecto)
bash
Copiar
Editar
npm run dev
Accede a http://localhost:5173

🚀 Despliegue en producción
Backend (Elastic Beanstalk)
Usa eb deploy desde /backend (requiere AWS CLI y EB CLI configuradas)

Frontend (GitHub Pages)
Haz npm run build y sube la carpeta dist/ al branch de GitHub Pages

🧑‍💻 Autor
José La Rosa
GitHub
LinkedIn

📜 Licencia
MIT

¿Ideas, dudas, bugs o quieres contribuir?
¡Crea un Issue o un Pull Request!
