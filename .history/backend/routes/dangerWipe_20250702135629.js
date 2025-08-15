// routes/dangerWipe.js
import { Router } from "express";
import fs from "fs/promises";
import path from "path";

// Define las rutas de TODOS tus JSON aquí (ajusta según la ruta real en producción)
const baseDir = process.env.NODE_ENV === "production"
  ? "/var/app/current" // RUTA BASE EN PRODUCCIÓN
  : process.cwd();     // RUTA BASE LOCAL

const filesToWipe = [
  path.join(baseDir, "backend/data/chats.json"),

  path.join(baseDir, "backend/data/profiles.json"),
  path.join(baseDir, "backend/data/projects.json"),
  path.join(baseDir, "data/users.json")
];

const router = Router();

router.post("/danger-wipe-all", async (_req, res) => {
  let ok = true;
  let errors = [];
  for (const file of filesToWipe) {
    try {
      await fs.writeFile(file, "[]"); // Si tus archivos son arrays, usa []; si son objetos, usa {}.
      console.log(`[danger-wipe-all] Archivo limpiado: ${file}`);
    } catch (err) {
      ok = false;
      errors.push({ file, error: err.message });
      console.error(`[danger-wipe-all] Error limpiando: ${file}`, err);
    }
  }
  res.json({ ok, errors, msg: ok ? "¡Todos los archivos han sido vaciados!" : "Algunos archivos no se pudieron limpiar", filesToWipe });
});

export default router;
