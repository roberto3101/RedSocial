import fs from "fs/promises";
import { dirname, resolve, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const DATA_DIR = process.env.NODE_ENV === "production" 
  ? "/var/www/RedSocial/backend/data"
  : join(__dirname, "data");
  
const FILE = resolve(DATA_DIR, "users.json");

/* ---------- Helpers de disco ---------- */
async function load() {
  try {
    const raw = await fs.readFile(FILE, "utf8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function save(users) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(users, null, 2));
}

/* ---------- API usada por auth.js ---------- */
export const findByEmail = async (email) =>
  (await load()).find((u) => u.email.toLowerCase() === email.toLowerCase());

export const findById = async (id) =>
  (await load()).find((u) => u.id === id);

/* inserta o actualiza por id (clave real)  */
export const upsert = async (user) => {
  const users = await load();
  const idx   = users.findIndex((u) => u.id === user.id);

  if (idx === -1) {
    users.push(user);                    // nuevo
  } else {
    users[idx] = { ...users[idx], ...user }; // actualiza
  }
  await save(users);
  return user;
};