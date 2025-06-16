import express from "express";
import cors from "cors";
import multer from "multer";
import fs from "fs";
import path from "path";
import "dotenv/config";
import session from "express-session";
import passport from "passport";

import profileRoutes     from "./routes/profile.js";
import postsRoutes       from "./routes/posts.js";
import authRoutes        from "./routes/auth.js";
import chatSearchRouter  from "./routes/ChatSearch.js";
import projectsRoutes    from "./routes/projects.js";
import searchRouter      from "./routes/search.js";
import chatsRouter       from "./routes/chats.js";
import "./passport.js";

const app  = express();
const PORT = process.env.PORT || 3001;

// ─────────── CORS seguro para producción y desarrollo ───────────
const allowedOrigins = [
  process.env.FRONT_URL,                 // producción
  "http://localhost:5173",               // desarrollo vite
  "http://localhost:3000",               // otro puerto común
];

app.use(cors({
  origin: function(origin, callback) {
    // Permite peticiones sin origin (como Postman) o si está permitido
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("No permitido por CORS"));
    }
  },
  credentials: true
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ─────────── Rutas API ───────────
app.get("/", (_req, res) => res.send("OK"));

app.use("/api/search",      searchRouter);
app.use("/api/projects",    projectsRoutes);
app.use("/api/chat-search", chatSearchRouter);
app.use("/api/chats",       chatsRouter);

// ─────────── Passport (OAuth) ───────────
app.use(session({
  secret: process.env.SESSION_SECRET || "supersecret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    sameSite: "none",
    secure: true
  }
}));
app.use(passport.initialize());
app.use(passport.session());

// ─────────── Carpeta de uploads ───────────
const uploadDir = process.env.NODE_ENV === "production"
  ? "/tmp/uploads"
  : "./uploads";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
app.use("/uploads", express.static(path.resolve(uploadDir)));

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename:    (_req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// ******* CAMBIO AQUÍ: CloudFront en producción *******
app.post("/api/upload-image", upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No se subió imagen" });

  let baseUrl;
  if (process.env.NODE_ENV === "production") {
    baseUrl = "https://d315m7tpvzh3ta.cloudfront.net"; // <--- TU URL DE CLOUD
  } else {
    baseUrl = `${req.protocol}://${req.headers.host}`;
  }

  res.json({ url: `${baseUrl}/uploads/${req.file.filename}` });
});
// ******* FIN DEL CAMBIO *******

app.use("/api/profile", profileRoutes);
app.use("/api/posts",   postsRoutes);
app.use("/auth",        authRoutes);

// ─────────── Arranque ───────────
app.listen(PORT, () =>
  console.log(`✅ API corriendo en http://localhost:${PORT}`)
);
