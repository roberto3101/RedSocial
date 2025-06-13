import express from "express";
import cors from "cors";
import multer from "multer";
import fs from "fs";
import path from "path";
import "dotenv/config";
import session from "express-session";
import passport from "passport";

import profileRoutes from "./routes/profile.js";
import postsRoutes   from "./routes/posts.js";
import authRoutes    from "./routes/auth.js";
import chatSearchRouter from "./routes/ChatSearch.js";
import projectsRoutes from "./routes/projects.js"; // rutas de proyectos
import "./passport.js";                     // estrategias OAuth
import searchRouter from "./routes/search.js";
import chatsRouter from "./routes/chats.js";
const app  = express();
const PORT = process.env.PORT || 3001;

/* ───── Middlewares globales ───── */
app.use(cors({ origin: process.env.FRONT_URL, credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use("/api/search", searchRouter);
app.use("/api/projects", projectsRoutes); // ruta de proyectos
app.use("/api/chat-search", chatSearchRouter);
app.use("/api/chats", chatsRouter);
/* ───── Passport (solo para flujos OAuth) ───── */
app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

/* ───── Carpeta de uploads ───── */
const uploadDir = "./uploads";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
app.use("/uploads", express.static(path.resolve(uploadDir)));

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename:    (_req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

app.post("/api/upload-image", upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No se subió imagen" });
  res.json({ url: `http://localhost:${PORT}/uploads/${req.file.filename}` });
});

/* ───── Rutas API ───── */
app.use("/api/profile", profileRoutes);  // /api/profile para CRUD de perfil
app.use("/api/posts",   postsRoutes);
app.use("/auth",        authRoutes);

/* ───── Arranque ───── */
app.listen(PORT, () =>
  console.log(`✅ API corriendo en http://localhost:${PORT}`)
);