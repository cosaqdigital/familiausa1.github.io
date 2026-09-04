import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const DIST = path.join(ROOT, "dist");
const SITE_URL = "https://familiausa1.com";

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(full));
    else if (entry.isFile() && entry.name.endsWith(".html")) files.push(full);
  }
  return files;
}

function rel(file) {
  return path.relative(DIST, file).replace(/\\/g, "/");
}

function sourceKind(relativePath) {
  if (relativePath.startsWith("articles/")) return "article";
  if (relativePath.startsWith("categorias/")) return "category";
  return "hub";
}

function articleSlugFromPathname(pathname) {
  const match = pathname.match(/^\/articles\/([^/]+?)(?:\.html)?\/?$/);
  return match?.[1] || null;
}

function pageUrl(relativePath) {
  const pathname = relativePath === "index.html" ? "/" : `/${relativePath}`;
  return new URL(pathname, SITE_URL).href;
}

function internalArticleTargets(html, relativePath) {
  const targets = new Set();
  const hrefPattern = /\bhref=["']([^"']+)["']/gi;
  for (const match of html.matchAll(hrefPattern)) {
    const href = match[1].trim();
    if (!href || href.startsWith("#") || /^(mailto:|tel:|javascript:)/i.test(href)) continue;

    let url;
    try {
      url = new URL(href, pageUrl(relativePath));
    } catch {
      continue;
    }

    if (url.origin !== new URL(SITE_URL).origin) continue;
    const slug = articleSlugFromPathname(url.pathname);
    if (slug) targets.add(slug);
  }
  return targets;
}

if (!fs.existsSync(DIST)) {
  throw new Error("dist/ nao encontrado. Execute npm run build antes da auditoria.");
}

const htmlFiles = walk(DIST);
const articleFiles = htmlFiles.filter((file) => rel(file).startsWith("articles/"));
const articleSlugs = new Set(
  articleFiles
    .map((file) => articleSlugFromPathname(new URL(pageUrl(rel(file))).pathname))
    .filter(Boolean)
);

const inbound = Object.fromEntries(
  [...articleSlugs].map((slug) => [slug, { article: new Set(), category: new Set(), hub: new Set() }])
);

for (const file of htmlFiles) {
  const relativePath = rel(file);
  const html = fs.readFileSync(file, "utf8");
  const kind = sourceKind(relativePath);
  const sourceSlug = kind === "article" ? articleSlugFromPathname(new URL(pageUrl(relativePath)).pathname) : null;

  for (const targetSlug of internalArticleTargets(html, relativePath)) {
    if (!articleSlugs.has(targetSlug) || targetSlug === sourceSlug) continue;
    inbound[targetSlug][kind].add(relativePath);
  }
}

const rows = [...articleSlugs]
  .map((slug) => {
    const counts = inbound[slug];
    const articleIn = counts.article.size;
    const categoryIn = counts.category.size;
    const hubIn = counts.hub.size;
    return {
      slug,
      articleIn,
      categoryIn,
      hubIn,
      totalIn: articleIn + categoryIn + hubIn
    };
  })
  .sort((a, b) => a.totalIn - b.totalIn || a.articleIn - b.articleIn || a.slug.localeCompare(b.slug));

const trueOrphans = rows.filter((row) => row.totalIn === 0);
const noContextualInbound = rows.filter((row) => row.articleIn === 0 && row.categoryIn === 0);
const weakArticleInbound = rows.filter((row) => row.articleIn === 0 && row.categoryIn > 0);

console.log(`Auditoria de links renderizados: ${htmlFiles.length} paginas HTML, ${rows.length} artigos.`);
console.log(`Orfaos reais (nenhum link interno): ${trueOrphans.length}.`);
console.log(`Sem link de artigo nem categoria: ${noContextualInbound.length}.`);
console.log(`Somente hub/categoria, sem link contextual de outro artigo: ${weakArticleInbound.length}.`);

function printRows(label, items, limit = 40) {
  console.log(`\n${label}`);
  if (!items.length) {
    console.log("- nenhum");
    return;
  }
  for (const row of items.slice(0, limit)) {
    console.log(`- ${row.slug}: artigos=${row.articleIn}, categorias=${row.categoryIn}, outros_hubs=${row.hubIn}, total=${row.totalIn}`);
  }
  if (items.length > limit) console.log(`- ... e mais ${items.length - limit}`);
}

printRows("Orfaos reais", trueOrphans);
printRows("Sem link contextual de artigo ou categoria", noContextualInbound);
printRows("Recebem categoria, mas nenhum link de outro artigo", weakArticleInbound);

const reportDir = path.join(DIST, "reports");
fs.mkdirSync(reportDir, { recursive: true });
fs.writeFileSync(
  path.join(reportDir, "internal-link-audit.json"),
  `${JSON.stringify({ generatedAt: new Date().toISOString(), summary: {
    htmlPages: htmlFiles.length,
    articles: rows.length,
    trueOrphans: trueOrphans.length,
    noContextualInbound: noContextualInbound.length,
    weakArticleInbound: weakArticleInbound.length
  }, rows }, null, 2)}\n`,
  "utf8"
);

if (trueOrphans.length > 0) {
  process.exitCode = 1;
}
