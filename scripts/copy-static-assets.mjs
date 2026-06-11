import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const source = path.join(root, "assets");
const target = path.join(root, "dist", "assets");
const publicRootFiles = [
  "CNAME",
  "robots.txt",
  "favicon.ico",
  "apple-touch-icon.png",
  "site.webmanifest",
  "manifest.webmanifest",
  "manifest.json"
];

if (!fs.existsSync(source)) {
  console.warn("assets/ nao encontrado; nada para copiar.");
} else {
  fs.rmSync(target, { recursive: true, force: true });
  fs.cpSync(source, target, { recursive: true });
  console.log("assets/ copiado para dist/assets.");
}

for (const fileName of publicRootFiles) {
  const sourceFile = path.join(root, fileName);
  if (!fs.existsSync(sourceFile)) {
    continue;
  }

  fs.copyFileSync(sourceFile, path.join(root, "dist", fileName));
  console.log(`${fileName} copiado para dist/${fileName}.`);
}
