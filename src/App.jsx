// ─── src/App.jsx ─────────────────────────────────────────────
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createPortal } from "react-dom";

/* -------------- Páginas y componentes -------------- */
import Home from "./Sections/Home/";
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
import UserBlog from "./pages/Blog/UserBlog"; // ⬅️ importa el componente
import NotFound from "./pages/NotFound";
import CustomCursor from "./components/CustomCursor";
import "./components/EditPostModal"; // registra el modal globalmente si lo necesitas

import ProfilePage from "./pages/Profile/ProfilePage";

/* --------------------------------------------------- */
export default function App() {
  return (
    <AuthProvider>
      <ProfileProvider>
        <BrowserRouter>
          <Routes>
            {/* ----------- Rutas públicas ----------- */}
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />

            {/* ----------- Auth ----------- */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/oauth/success" element={<OAuthSuccess />} />

            {/* ----------- Blog por usuario ----------- */}
            <Route path="/blog/user/:username" element={<UserBlog />} /> {/* <-- AQUÍ */}

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

            {/* ----------- Perfil público ----------- */}
            <Route path="/profile/:username" element={<ProfilePage />} />

            {/* ------------- 404 ------------- */}
            <Route path="*" element={<NotFound />} />
          </Routes>

          {/* Cursor personalizado */}
          {createPortal(<CustomCursor />, document.body)}
        </BrowserRouter>
      </ProfileProvider>
    </AuthProvider>
  );
}
// src/App.jsx