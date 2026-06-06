import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const source = path.join(root, "assets");
const target = path.join(root, "dist", "assets");

if (!fs.existsSync(source)) {
  console.warn("assets/ nao encontrado; nada para copiar.");
  process.exit(0);
}

fs.rmSync(target, { recursive: true, force: true });
fs.cpSync(source, target, { recursive: true });
console.log("assets/ copiado para dist/assets.");
