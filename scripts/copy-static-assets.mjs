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

const adsSource = path.join(root, "public", "ads.txt");
const adsTarget = path.join(root, "dist", "ads.txt");
const expectedAds = "google.com, pub-6243391837401331, DIRECT, f08c47fec0942fa0";

if (!fs.existsSync(adsSource)) process.exitCode = 1;
else {
  fs.copyFileSync(adsSource, adsTarget);
  const adsContent = fs.readFileSync(adsTarget, "utf8").trim();
  if (adsContent !== expectedAds) process.exitCode = 1;
  else console.log("ads.txt validado em dist/ads.txt.");
}
