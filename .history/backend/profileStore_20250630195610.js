import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Lógica para manejar rutas en desarrollo y producción
const dataDir = process.env.NODE_ENV === "production" 
  ? "/tmp"
  : path.join(__dirname, "data");
const file = path.join(dataDir, "profiles.json");

async function read() {
  try {
    return JSON.parse(await fs.readFile(file, "utf8"));
  } catch {
    return [];
  }
}

async function write(data) {
  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(file, JSON.stringify(data, null, 2));
}

export async function getProfileById(id) {
  return (await read()).find((p) => p.userId === id);
}

export async function upsertProfile(profile) {
  const list = await read();
  const idx = list.findIndex((p) => p.userId === profile.userId);
  
  // Asegurar que followers y following sean arrays
  if (!profile.followers) profile.followers = [];
  if (!profile.following) profile.following = [];
  
  if (idx >= 0) {
    list[idx] = { ...list[idx], ...profile };
  } else {
    list.push(profile);
  }
  
  await write(list);
}

export async function getProfileByUsername(username) {
  return (await read()).find((p) => p.username?.toLowerCase() === username.toLowerCase());
}

export async function getAllProfiles() {
  return await read();
}