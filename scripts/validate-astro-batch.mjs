import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const dist = path.join(root, "dist");
const batchPath = path.join(root, "src", "data", "legacy-extract", "migration-batch-20.json");
const batch = JSON.parse(fs.readFileSync(batchPath, "utf8"));
const articles = batch.articles ?? [];
const batchSlugs = new Set(articles.map((article) => article.slug));
const errors = [];

function toPosix(filePath) {
  return filePath.replaceAll("\\", "/");
}

function stripTags(value = "") {
  return value
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function readDistArticle(article) {
  const relativePath = `articles/${article.slug}.html`;
  const fullPath = path.join(dist, relativePath);
  if (!fs.existsSync(fullPath)) {
    errors.push(`Arquivo do lote nao gerado: ${relativePath}`);
    return "";
  }
  return fs.readFileSync(fullPath, "utf8");
}

function countMatches(html, pattern) {
  return [...html.matchAll(pattern)].length;
}

function extractMainArticleHtml(html) {
  const match = html.match(/<section\b[^>]*class=["'][^"']*\barticle-content\b[^"']*["'][^>]*>\s*<article>([\s\S]*?)<\/article>\s*<\/section>/i);
  return match?.[1]?.trim() ?? "";
}

function normalizeLinkTarget(currentFile, href) {
  const cleanHref = href.replace(/#.*$/, "");
  if (!cleanHref) return null;
  if (/^(https?:|mailto:|tel:|#)/i.test(cleanHref)) return null;

  const currentDir = path.posix.dirname(currentFile);
  return cleanHref.startsWith("/")
    ? cleanHref.slice(1)
    : path.posix.normalize(path.posix.join(currentDir, cleanHref));
}

function slugFromTarget(target) {
  const fileName = target.split("/").pop() ?? "";
  return fileName.endsWith(".html") ? fileName.replace(/\.html$/, "") : null;
}

for (const article of articles) {
  const html = readDistArticle(article);
  if (!html) continue;

  const relativeFile = `articles/${article.slug}.html`;
  const expectedCanonical = article.canonical ?? `https://familiausa1.com/${relativeFile}`;
  const mainArticleHtml = extractMainArticleHtml(html);
  const h1Count = countMatches(html, /<h1\b/gi);
  const siteHeaderCount = countMatches(html, /class=["'][^"']*\bsite-header\b/gi);
  const siteFooterCount = countMatches(html, /class=["'][^"']*\bsite-footer\b/gi);

  if (html.includes("PLACEHOLDER")) {
    errors.push(`PLACEHOLDER encontrado em artigo do lote: ${relativeFile}`);
  }
  if (!html.includes("G-5RND6F4L8G")) {
    errors.push(`Google Analytics ausente: ${relativeFile}`);
  }
  if (!html.includes(`rel="canonical" href="${expectedCanonical}"`)) {
    errors.push(`Canonical incorreto em ${relativeFile}: esperado ${expectedCanonical}`);
  }
  if (!/"@type"\s*:\s*"BlogPosting"/.test(html)) {
    errors.push(`BlogPosting ausente: ${relativeFile}`);
  }
  if ((article.visibleFaqs?.length ?? 0) > 0 && !/"@type"\s*:\s*"FAQPage"/.test(html)) {
    errors.push(`FAQPage nao gerado para artigo com FAQ visivel: ${relativeFile}`);
  }
  if (h1Count !== 1) {
    errors.push(`H1 deve ser unico em ${relativeFile}; encontrado ${h1Count}`);
  }
  if (!mainArticleHtml || stripTags(mainArticleHtml).length < 200) {
    errors.push(`Conteudo principal vazio ou curto no HTML gerado: ${relativeFile}`);
  }
  if (/site-header|site-footer|G-5RND6F4L8G|googletagmanager\.com/i.test(mainArticleHtml)) {
    errors.push(`Header, footer ou script antigo encontrado dentro do conteudo principal: ${relativeFile}`);
  }
  if (siteHeaderCount !== 1) {
    errors.push(`Header duplicado ou ausente em ${relativeFile}; encontrado ${siteHeaderCount}`);
  }
  if (siteFooterCount !== 1) {
    errors.push(`Footer duplicado ou ausente em ${relativeFile}; encontrado ${siteFooterCount}`);
  }

  for (const match of html.matchAll(/href="([^"]+)"/g)) {
    const href = match[1];
    const target = normalizeLinkTarget(relativeFile, href);
    if (!target) continue;
    const targetSlug = slugFromTarget(target);
    if (!targetSlug || !batchSlugs.has(targetSlug)) continue;
    const fullTarget = path.join(dist, target);
    if (!fs.existsSync(fullTarget)) {
      errors.push(`Link interno entre artigos do lote quebrado em ${relativeFile}: ${href}`);
    }
  }
}

if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`Astro batch validado: ${articles.length} artigos, URLs .html preservadas, 0 erros criticos.`);
