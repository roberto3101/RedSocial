// remove-bom.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Compatible para ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Extensiones a limpiar (agrega las que uses)
const EXT = /\.(js|jsx|ts|tsx|json|css|html)$/i;

function stripBom(content) {
  return content.replace(/^\uFEFF/, "");
}

function processFile(file) {
  const content = fs.readFileSync(file, "utf8");
  if (content.charCodeAt(0) === 0xFEFF) {
    fs.writeFileSync(file, stripBom(content), "utf8");
    console.log("🧹 BOM eliminado:", file);
  }
}

function processDir(dir) {
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) processDir(fullPath);
    else if (EXT.test(file)) processFile(fullPath);
  });
}

processDir(__dirname); // ejecuta desde la carpeta actual
