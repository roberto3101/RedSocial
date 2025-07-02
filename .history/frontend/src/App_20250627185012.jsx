// ─── src/App.jsx ─────────────────────────────────────────────
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createPortal } from "react-dom";

/* -------------- Páginas y componentes -------------- */
import Home from "./Sections/Home.jsx";
import LandingPage from "./pages/LandingPage/LandingPage"; // 👈 AÑADIDO
import BlogIndex from "./pages/Blog/BlogIndex";
import PostPage from "./pages/Blog/PostPage";
import Projects from "./pages/Blog/Projects/Projects";
import PostForm from "./pages/Blog/PostForm";

import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import VerifyEmail from "./pages/Auth/VerifyEmail";
import OAuthSuccess from "./pages/Auth/OAuthSuccess";
import { AuthProvider } from "./context/AuthContext";
import { ProfileProvider } from "./context/ProfileContext";
import CreateProfile from "./pages/Profile/CreateProfile";
import ProtectedRoute from "./components/ProtectedRoute";
import UserBlog from "./pages/Blog/UserBlog";
import NotFound from "./pages/NotFound";
import CustomCursor from "./components/CustomCursor";
import "./components/EditPostModal";

import ProfilePage from "./pages/Profile/ProfilePage";
import ChatWidget from "./components/ChatWidget";

import { SocketProvider } from "./context/SocketContext";

/* --------------------------------------------------- */
export default function App() {
  return (
    <AuthProvider>
      <ProfileProvider>
        <SocketProvider>
          <BrowserRouter basename={import.meta.env.DEV ? undefined : "/RedSocial"}>
            <Routes>
              {/* ----------- Rutas públicas ----------- */}
                
              <Route path="/" element={<LandingPage />} /> {/* 👈 CAMBIADO */}
              <Route path="/home" element={<Home />} />
              {/* ----------- Proyectos global y por usuario ----------- */}
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:username" element={<Projects />} />
              <Route path="/profile/:username/projects" element={<Projects />} />
              <Route path="/user/:username/projects" element={<Projects />} />

              {/* ----------- Auth ----------- */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/oauth/success" element={<OAuthSuccess />} />

              {/* ----------- Blog por usuario ----------- */}
              <Route path="/blog/user/:username" element={<UserBlog />} />

              {/* ----------- Rutas de blog (públicas) ----------- */}
              <Route path="/blog" element={<BlogIndex />} />
              <Route path="/blog/:slug" element={<PostPage />} />

              {/* ----------- Rutas protegidas ----------- */}
              <Route
                path="/create-profile"
                element={
                  <ProtectedRoute>
                    <CreateProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/blog/nuevo"
                element={
                  <ProtectedRoute>
                    <PostForm />
                  </ProtectedRoute>
                }
              />

              {/* ----------- Perfil público y de visitante ----------- */}
              <Route path="/profile/:username" element={<ProfilePage />} />
              <Route path="/user/:username" element={<ProfilePage />} />

              {/* ------------- 404 ------------- */}
              <Route path="*" element={<NotFound />} />
            </Routes>

            {/* Widget de chat flotante */}
            <ChatWidget />

            {/* Cursor personalizado */}
            {createPortal(<CustomCursor />, document.body)}
          </BrowserRouter>
        </SocketProvider>
      </ProfileProvider>
    </AuthProvider>
  );
}