// routes/dangerWipe.js
import { Router } from "express";
import fs from "fs/promises";
import path from "path";

// Define las rutas de TODOS tus JSON aquí (ajusta según la ruta real en producción)
const baseDir = process.env.NODE_ENV === "production"
  ? "/var/app/current" // RUTA BASE EN PRODUCCIÓN (Elastic Beanstalk)
  : process.cwd();     // RUTA BASE LOCAL

const filesToWipe = [
  path.join(baseDir, "backend/data/chats.json"),
  path.join(baseDir, "backend/data/profiles.json"),
  path.join(baseDir, "backend/data/projects.json"),
  path.join(baseDir, "data/users.json"),
];

const router = Router();

router.post("/danger-wipe-all", async (_req, res) => {
  let ok = true;
  let errors = [];
  let cleaned = [];
  let created = [];

  for (const file of filesToWipe) {
    try {
      await fs.writeFile(file, "[]");
      cleaned.push(file);
      console.log(`[danger-wipe-all] ✅ Archivo limpiado: ${file}`);
    } catch (err) {
      if (err.code === "ENOENT") {
        // Si la carpeta o archivo no existe, créalos
        try {
          await fs.mkdir(path.dirname(file), { recursive: true });
          await fs.writeFile(file, "[]");
          created.push(file);
          console.log(`[danger-wipe-all] 🆕 Carpeta/archivo creados y limpiados: ${file}`);
        } catch (mkdirErr) {
          ok = false;
          errors.push({ file, error: mkdirErr.message });
          console.error(`[danger-wipe-all] ❌ Error creando carpeta/archivo: ${file}`, mkdirErr);
        }
      } else {
        ok = false;
        errors.push({ file, error: err.message });
        console.error(`[danger-wipe-all] ❌ Error limpiando: ${file}`, err);
      }
    }
  }

  res.json({
    ok,
    cleaned,
    created,
    errors,
    filesToWipe,
    msg: ok
      ? `¡Todos los archivos han sido vaciados! Limpiados: ${cleaned.length}, Creados: ${created.length}`
      : "Algunos archivos no se pudieron limpiar",
  });
});

export default router;
