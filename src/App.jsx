// ─── src/App.jsx ─────────────────────────────────────────────
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createPortal } from "react-dom";

/* -------------- Páginas y componentes -------------- */
import Home            from "./Sections/Home/";
import BlogIndex       from "./pages/Blog/BlogIndex";
import PostPage        from "./pages/Blog/PostPage";
import Projects        from "./pages/Blog/Projects/Projects";
import PostForm        from "./pages/Blog/PostForm";

import Login           from "./pages/Auth/Login";
import Register        from "./pages/Auth/Register";
import VerifyEmail     from "./pages/Auth/VerifyEmail";
import OAuthSuccess    from "./pages/Auth/OAuthSuccess";
import { AuthProvider }  from "./context/AuthContext";
import CreateProfile   from "./pages/Profile/CreateProfile";
import ProtectedRoute  from "./components/ProtectedRoute";

import NotFound        from "./pages/NotFound";
import CustomCursor    from "./components/CustomCursor";
import "./components/EditPostModal";           // registra el modal globalmente si lo necesitas

/* --------------------------------------------------- */
export default function App() {
  return (
    <AuthProvider>
    <BrowserRouter>
      <Routes>
        {/* ----------- Rutas públicas ----------- */}
        <Route path="/"                 element={<Home />} />
        <Route path="/blog"             element={<BlogIndex />} />
        <Route path="/blog/:slug"       element={<PostPage />} />
        <Route path="/projects"         element={<Projects />} />
        <Route path="/blog/nuevo"       element={<PostForm />} />

        {/* ----------- Auth ----------- */}
        <Route path="/login"            element={<Login />} />
        <Route path="/register"         element={<Register />} />
        <Route path="/verify-email"     element={<VerifyEmail />} />
        <Route path="/oauth/success"    element={<OAuthSuccess />} />

        {/* ----------- Rutas protegidas ----------- */}
        <Route
          path="/create-profile"
          element={
            <ProtectedRoute>
              <CreateProfile />
            </ProtectedRoute>
          }
        />

        {/* ------------- 404 ------------- */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Cursor personalizado */}
      {createPortal(<CustomCursor />, document.body)}
    </BrowserRouter>
    </AuthProvider>
  );
}
