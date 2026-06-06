import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const dist = path.join(root, "dist");

const expectedPages = [
  "index.html",
  "blog.html",
  "categorias.html",
  "comece-aqui.html",
  "sobre.html",
  "checklist-mudanca-eua.html",
  "articles/custo-de-vida-nos-eua-2026-atualizado.html",
  "articles/morar-legalmente-nos-eua-caminhos-possiveis-2026.html",
  "articles/asilo-nos-estados-unidos-2026.html",
  "articles/morar-em-boston-2026.html",
  "articles/cidades-da-florida-com-mais-brasileiros-2026.html",
  "categorias/imigracao-legalizacao.html",
  "categorias/custo-de-vida.html",
  "categorias/cidades-da-florida.html",
  "categorias/cidades-do-norte-e-massachusetts.html"
];

const errors = [];

function readDist(file) {
  const fullPath = path.join(dist, file);
  if (!fs.existsSync(fullPath)) {
    errors.push(`Arquivo esperado nao gerado: ${file}`);
    return "";
  }
  return fs.readFileSync(fullPath, "utf8");
}

for (const file of expectedPages) {
  const html = readDist(file);
  if (!html) continue;

  if (!html.includes("G-5RND6F4L8G")) {
    errors.push(`Google Analytics ausente: ${file}`);
  }
  if (!html.includes("<header class=\"site-header\"")) {
    errors.push(`Header ausente: ${file}`);
  }
  if (!html.includes("<footer class=\"site-footer\"")) {
    errors.push(`Footer ausente: ${file}`);
  }
  if (!html.includes("rel=\"canonical\"")) {
    errors.push(`Canonical ausente: ${file}`);
  }

  if (file.startsWith("articles/") && !html.includes("\"@type\":\"BlogPosting\"")) {
    errors.push(`BlogPosting ausente: ${file}`);
  }
  if (file.startsWith("categorias/") && !html.includes("\"@type\":\"CollectionPage\"")) {
    errors.push(`CollectionPage ausente: ${file}`);
  }
}

for (const file of expectedPages) {
  const html = readDist(file);
  if (!html) continue;
  const currentDir = path.dirname(file);
  const matches = html.matchAll(/href="([^"]+)"/g);
  for (const match of matches) {
    const href = match[1];
    if (/^(https?:|mailto:|tel:|#)/.test(href)) continue;
    const cleanHref = href.replace(/#.*$/, "");
    if (!cleanHref) continue;
    const relativeTarget = cleanHref.startsWith("/")
      ? cleanHref.slice(1)
      : path.posix.normalize(path.posix.join(currentDir === "." ? "" : currentDir, cleanHref));
    const fullTarget = path.join(dist, relativeTarget);
    if (!fs.existsSync(fullTarget)) {
      errors.push(`Link interno quebrado em ${file}: ${href}`);
    }
  }
}

if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`Astro POC validado: ${expectedPages.length} paginas, 0 links internos quebrados.`);
