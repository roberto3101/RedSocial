import { Router } from "express";
import { verifyToken } from "../middleware/auth.js";
import fs from "fs";
import path from "path";

const router = Router();
const PROJECTS_FILE = process.env.NODE_ENV === "production"
  ? "/var/www/RedSocial/data/projects.json"
  : path.resolve("./data/projects.json");

// Asegura la carpeta y archivo
if (!fs.existsSync(path.dirname(PROJECTS_FILE))) fs.mkdirSync(path.dirname(PROJECTS_FILE), { recursive: true });
if (!fs.existsSync(PROJECTS_FILE)) fs.writeFileSync(PROJECTS_FILE, "[]");

function readProjects() {
  return JSON.parse(fs.readFileSync(PROJECTS_FILE, "utf8"));
}
function writeProjects(projects) {
  fs.writeFileSync(PROJECTS_FILE, JSON.stringify(projects, null, 2));
}

// Obtener todos los proyectos de un usuario (público)
router.get("/:username", (req, res) => {
  const projects = readProjects().filter(
    (p) => p.username?.toLowerCase() === req.params.username.toLowerCase()
  );
  res.json(projects);
});

// Agregar un proyecto (solo dueño)
router.post("/", verifyToken, (req, res) => {
  const { name, brief, technologies, repo, image } = req.body;
  if (!name || !repo)
    return res.status(400).json({ msg: "Faltan campos requeridos" });

  const projects = readProjects();
  const id = Date.now().toString();
  const project = {
    id,
    username: req.user.username,
    name,
    brief,
    technologies,
    repo,
    image,
  };
  projects.push(project);
  writeProjects(projects);
  res.status(201).json(project);
});

// Editar un proyecto (solo dueño)
router.put("/:id", verifyToken, (req, res) => {
  const { id } = req.params;
  const projects = readProjects();
  const idx = projects.findIndex(
    (p) => p.id === id && p.username === req.user.username
  );
  if (idx === -1) return res.status(404).json({ msg: "No encontrado" });
  projects[idx] = { ...projects[idx], ...req.body };
  writeProjects(projects);
  res.json(projects[idx]);
});

// Eliminar un proyecto (solo dueño)
router.delete("/:id", verifyToken, (req, res) => {
  const { id } = req.params;
  let projects = readProjects();
  const found = projects.find(
    (p) => p.id === id && p.username === req.user.username
  );
  if (!found) return res.status(404).json({ msg: "No encontrado" });
  projects = projects.filter((p) => !(p.id === id && p.username === req.user.username));
  writeProjects(projects);
  res.json({ ok: true });
});

export default router;