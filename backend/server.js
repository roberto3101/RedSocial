import express from "express";
import cors from "cors";
import multer from "multer";
import fs from "fs";
import path from "path";
import "dotenv/config";
import session from "express-session";
import passport from "passport";
import profileRoutes from "./routes/profile.js";
import postsRoutes from "./routes/posts.js";
import authRoutes from "./routes/auth.js";
import "./passport.js";                            // inicializa estrategias
import "dotenv/config";   // carga .env

const app  = express();
const PORT = process.env.PORT || 3001;

/* ───── Middlewares globales ───── */
app.use(cors({ origin: process.env.FRONT_URL, credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use("/api/profile", profileRoutes);
/* ───── Passport (sessiones solo para OAuth) ───── */
app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

/* ───── Carpeta de uploads e imágenes ───── */
const uploadDir = "./uploads";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
app.use("/uploads", express.static(path.resolve(uploadDir)));

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

app.post("/api/upload-image", upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No se subió imagen" });
  res.json({ url: `http://localhost:${PORT}/uploads/${req.file.filename}` });
});

/* ───── Rutas existentes ───── */
app.use("/api/posts", postsRoutes);

/* ───── Rutas de autenticación ───── */
app.use("/auth", authRoutes);

/* ───── Arranque ───── */
app.listen(PORT, () => console.log(`✅ API en http://localhost:${PORT}`));
