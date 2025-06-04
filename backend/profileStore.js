import fs from "fs/promises";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const file = `${__dirname}/profiles.json`;

async function read() {
  try { return JSON.parse(await fs.readFile(file, "utf8")); }
  catch { return []; }
}
async function write(data) {
  await fs.writeFile(file, JSON.stringify(data, null, 2));
}

export async function getProfileById(id) {
  return (await read()).find(p => p.userId === id);
}
export async function upsertProfile(profile) {
  const list = await read();
  const idx  = list.findIndex(p => p.userId === profile.userId);
  if (idx >= 0) list[idx] = { ...list[idx], ...profile };
  else list.push(profile);
  await write(list);
}
