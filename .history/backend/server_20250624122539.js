// server.js
import express from "express";
import cors from "cors";
import multer from "multer";
import fs from "fs";
import path from "path";
import "dotenv/config";
import session from "express-session";
import passport from "passport";
import http from "http";
import { Server as SocketServer } from "socket.io";

// ─────────── Importa tus rutas ───────────
import profileRoutes     from "./routes/profile.js";
import postsRoutes       from "./routes/posts.js";
import authRoutes        from "./routes/auth.js";
import chatSearchRouter  from "./routes/ChatSearch.js";
import projectsRoutes    from "./routes/projects.js";
import searchRouter      from "./routes/search.js";
import chatsRouter       from "./routes/chats.js";
import "./passport.js";

// ─────────── Setup Express y HTTP server ───────────
const app    = express();
const server = http.createServer(app);
const PORT   = process.env.PORT || 3001;

// ─────────── CORS seguro ───────────
const allowedOrigins = [
  process.env.FRONT_URL?.replace(/\/$/, ""),
  "https://roberto3101.github.io",
  "https://roberto3101.github.io/RedSocial",
  "http://localhost:5173",
  "http://localhost:3000"
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin.replace(/\/$/, ""))) {
      callback(null, true);
    } else {
      console.log("CORS bloqueado:", origin);
      callback(new Error("No permitido por CORS"));
    }
  },
  credentials: true
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ─────────── LOG DE REQUESTS (debug) ───────────
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

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
  cookie: process.env.NODE_ENV === "production"
    ? { sameSite: "none", secure: true }
    : {}  // Así funciona local sin HTTPS
}));
app.use(passport.initialize());
app.use(passport.session());

// ─────────── Carpeta de uploads ───────────
const uploadDir = process.env.NODE_ENV === "production"
  ? "/tmp/uploads"
  : path.resolve("./uploads"); // ← ¡usa ruta absoluta!
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Esto permite acceder a las imágenes por http://localhost:3001/uploads/xxxx.jpg
app.use("/uploads", express.static(uploadDir));

// ─────────── Multer para subir imágenes ───────────
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename:    (_req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// Endpoint de subida de imagenes
app.post("/api/upload-image", upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No se subió imagen" });
  let baseUrl;
  if (process.env.NODE_ENV === "production") {
    // Cambia esto solo si usas S3/CloudFront en el futuro
    baseUrl = "https://d315m7tpvzh3ta.cloudfront.net";
  } else {
    // LOCAL: ejemplo http://localhost:3001
    baseUrl = `${req.protocol}://${req.headers.host}`;
  }
  res.json({ url: `${baseUrl}/uploads/${req.file.filename}` });
});

// ─────────── Rutas protegidas y recursos ───────────
app.use("/api/profile", profileRoutes);
app.use("/api/posts",   postsRoutes);
app.use("/auth",        authRoutes);

// ─────────── SOCKET.IO para mensajes en tiempo real ───────────
const io = new SocketServer(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true
  }
});

let onlineUsers = {};

io.on("connection", (socket) => {
  socket.on("register", (username) => {
    onlineUsers[username] = socket.id;
    socket.username = username;
    console.log("Usuario registrado en WebSocket:", username);
  });

  socket.on("private-message", ({ to, message }) => {
    console.log("Mensaje recibido por socket:", {
      from: socket.username,
      to,
      message
    });

    const targetSocketId = onlineUsers[to];
    if (targetSocketId) {
      io.to(targetSocketId).emit("private-message", {
        from: socket.username,
        message
      });
    }
    if (socket.username) {
      socket.emit("private-message", {
        from: socket.username,
        message
      });
    }
  });

  socket.on("disconnect", () => {
    if (socket.username) {
      delete onlineUsers[socket.username];
      console.log("Usuario desconectado:", socket.username);
    }
  });
});

// ─────────── Arranque ───────────
server.listen(PORT, () =>
  console.log(`✅ API y WebSocket corriendo en http://localhost:${PORT} (modo ${process.env.NODE_ENV})`)
);

