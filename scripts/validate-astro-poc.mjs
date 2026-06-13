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

const expectedArticlePages = expectedPages.filter((file) => file.startsWith("articles/"));
const expectedCategoryPages = expectedPages.filter((file) => file.startsWith("categorias/"));
const expectedPageSet = new Set(expectedPages);
const errors = [];
const missingExpectedPages = [];

function listGeneratedHtml() {
  if (!fs.existsSync(dist)) {
    return [];
  }

  return fs.readdirSync(dist, { recursive: true })
    .map((file) => String(file).replaceAll("\\", "/"))
    .filter((file) => file.endsWith(".html"))
    .sort();
}

function readDist(file) {
  const fullPath = path.join(dist, file);
  if (!fs.existsSync(fullPath)) {
    errors.push(`Arquivo esperado nao gerado: ${file}`);
    missingExpectedPages.push(file);
    return "";
  }
  return fs.readFileSync(fullPath, "utf8");
}

function canonicalFor(file) {
  if (file === "index.html") {
    return "https://familiausa1.com/";
  }

  return `https://familiausa1.com/${file}`;
}

for (const file of expectedPages) {
  const html = readDist(file);
  if (!html) continue;

  if (html.includes("PLACEHOLDER")) {
    errors.push(`PLACEHOLDER encontrado em pagina piloto: ${file}`);
  }
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
  if (!html.includes(`href="${canonicalFor(file)}"`)) {
    errors.push(`Canonical familiausa1.com incorreto ou ausente em ${file}: esperado ${canonicalFor(file)}`);
  }

  if (expectedArticlePages.includes(file) && !/"@type"\s*:\s*"BlogPosting"/.test(html)) {
    errors.push(`BlogPosting ausente: ${file}`);
  }
  if (expectedCategoryPages.includes(file) && !/"@type"\s*:\s*"CollectionPage"/.test(html)) {
    errors.push(`CollectionPage ausente: ${file}`);
  }
}

for (const file of fs.readdirSync(dist, { recursive: true })) {
  const relativeFile = String(file).replaceAll("\\", "/");
  if (!relativeFile.endsWith(".html")) continue;
  const fullPath = path.join(dist, relativeFile);
  if (!fs.statSync(fullPath).isFile()) continue;
  const html = fs.readFileSync(fullPath, "utf8");
  if (html.includes("PLACEHOLDER")) {
    errors.push(`PLACEHOLDER encontrado em arquivo gerado: ${relativeFile}`);
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
    const isPilotPage = expectedPageSet.has(relativeTarget);
    const isAsset = relativeTarget.startsWith("assets/");
    if (!isPilotPage && !isAsset) {
      continue;
    }
    const fullTarget = path.join(dist, relativeTarget);
    if (!fs.existsSync(fullTarget)) {
      errors.push(`Link interno quebrado em ${file}: ${href}`);
    }
  }
}

if (errors.length > 0) {
  if (missingExpectedPages.length > 0) {
    const generatedHtml = listGeneratedHtml();
    console.error("\nArquivos .html encontrados em dist:");
    console.error(generatedHtml.length ? generatedHtml.slice(0, 80).join("\n") : "(nenhum .html encontrado)");
  }
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`Astro POC validado: ${expectedPages.length} paginas, 0 links internos quebrados.`);
