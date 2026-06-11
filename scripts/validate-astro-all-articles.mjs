import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const dist = path.join(root, "dist");
const legacyPath = path.join(root, "src", "data", "legacy-extract", "legacy-articles.json");
const reportPath = path.join(root, "src", "data", "legacy-extract", "astro-all-articles-report.md");
const articlesJsonPath = path.join(root, "assets", "data", "articles.json");
const sitemapPath = path.join(root, "sitemap.xml");
const siteUrl = "https://familiausa1.com";

const legacy = JSON.parse(fs.readFileSync(legacyPath, "utf8"));
const legacyArticles = legacy.articles ?? [];
const legacySlugs = new Set(legacyArticles.map((article) => article.slug));
const legacyPaths = new Set(legacyArticles.map((article) => article.originalPath));
const errors = [];
const warnings = [];

function toPosix(filePath) {
  return filePath.replaceAll("\\", "/");
}

function normalizePath(value = "") {
  return toPosix(String(value))
    .replace(/^https?:\/\/familiausa1\.com\/?/i, "")
    .replace(/^\/+/, "")
    .replace(/#.*$/, "")
    .trim();
}

function stripTags(value = "") {
  return value
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeText(value = "") {
  return stripTags(String(value))
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenSimilarity(left = "", right = "") {
  const leftTokens = new Set(normalizeText(left).split(" ").filter(Boolean));
  const rightTokens = new Set(normalizeText(right).split(" ").filter(Boolean));
  if (leftTokens.size === 0 && rightTokens.size === 0) return 1;
  if (leftTokens.size === 0 || rightTokens.size === 0) return 0;
  const intersection = [...leftTokens].filter((token) => rightTokens.has(token)).length;
  const union = new Set([...leftTokens, ...rightTokens]).size;
  return intersection / union;
}

function countMatches(html, pattern) {
  return [...html.matchAll(pattern)].length;
}

function extractMainArticleHtml(html) {
  const match = html.match(/<section\b[^>]*class=["'][^"']*\barticle-content\b[^"']*["'][^>]*>\s*<article>([\s\S]*?)<\/article>\s*<\/section>/i);
  return match?.[1]?.trim() ?? "";
}

function titleOf(html) {
  return html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim() ?? null;
}

function metaDescriptionOf(html) {
  return html.match(/<meta name="description" content="([^"]*)"/i)?.[1]?.trim() ?? null;
}

function canonicalOf(html) {
  return html.match(/<link rel="canonical" href="([^"]+)"/i)?.[1]?.trim() ?? null;
}

function normalizeTarget(currentFile, href) {
  const cleanHref = href.replace(/#.*$/, "");
  if (!cleanHref || /^(https?:|mailto:|tel:|#)/i.test(cleanHref)) return null;
  if (cleanHref.startsWith("javascript:")) return null;
  const currentDir = path.posix.dirname(currentFile);
  return cleanHref.startsWith("/")
    ? cleanHref.slice(1)
    : path.posix.normalize(path.posix.join(currentDir, cleanHref));
}

function slugFromTarget(target) {
  const fileName = target.split("/").pop() ?? "";
  return fileName.endsWith(".html") ? fileName.replace(/\.html$/, "") : null;
}

function findVisibleEscapedTags(mainArticleHtml) {
  const text = stripTags(mainArticleHtml);
  const escapedMatches = text.match(/&lt;\/?(?:p|h1|h2|h3|table|ul|ol|li|section|article|div|script|footer|header)\b/gi);
  return [...new Set(escapedMatches ?? [])];
}

function readArticlesJson() {
  if (!fs.existsSync(articlesJsonPath)) {
    return { exists: false, entries: [] };
  }

  const parsed = JSON.parse(fs.readFileSync(articlesJsonPath, "utf8"));
  return {
    exists: true,
    entries: Array.isArray(parsed) ? parsed : parsed.articles ?? []
  };
}

function readSitemap() {
  if (!fs.existsSync(sitemapPath)) {
    return { exists: false, urls: [], duplicates: [], pathSet: new Set() };
  }

  const xml = fs.readFileSync(sitemapPath, "utf8");
  const urls = [...xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi)].map((match) => match[1].trim());
  const counts = new Map();
  for (const url of urls) {
    counts.set(url, (counts.get(url) ?? 0) + 1);
  }

  return {
    exists: true,
    urls,
    duplicates: [...counts.entries()].filter(([, count]) => count > 1).map(([url, count]) => ({ url, count })),
    pathSet: new Set(urls.map(normalizePath))
  };
}

const articlesJson = readArticlesJson();
const sitemap = readSitemap();
const articleJsonByPath = new Map();
for (const entry of articlesJson.entries) {
  const normalized = normalizePath(entry.url ?? "");
  if (normalized) {
    articleJsonByPath.set(normalized, entry);
  }
}

const generatedArticleFiles = fs.existsSync(path.join(dist, "articles"))
  ? fs.readdirSync(path.join(dist, "articles")).filter((file) => file.endsWith(".html")).sort()
  : [];

const generatedPaths = new Set(generatedArticleFiles.map((file) => `articles/${file}`));
const perArticle = [];
const titleDivergences = [];
const canonicalDivergences = [];
const shortArticles = [];
const migrationRiskArticles = [];
const linkWarnings = [];
const linkErrors = [];

if (generatedArticleFiles.length < legacyArticles.length) {
  errors.push(`Quantidade de artigos gerados menor que o acervo legado: esperado pelo menos ${legacyArticles.length}, encontrado ${generatedArticleFiles.length}.`);
}

for (const article of legacyArticles) {
  const relativeFile = `articles/${article.slug}.html`;
  const distFile = path.join(dist, relativeFile);
  const expectedCanonical = article.canonical ?? `${siteUrl}/${relativeFile}`;
  const item = {
    path: relativeFile,
    titleOk: false,
    canonicalOk: false,
    hasFaqPage: false,
    internalArticleLinksChecked: 0,
    internalArticleLinksBroken: 0,
    warnings: [],
    errors: []
  };

  if (!fs.existsSync(distFile)) {
    item.errors.push("Arquivo nao gerado em dist.");
    errors.push(`${relativeFile}: arquivo nao gerado em dist.`);
    perArticle.push(item);
    continue;
  }

  const html = fs.readFileSync(distFile, "utf8");
  const mainArticleHtml = extractMainArticleHtml(html);
  const mainText = stripTags(mainArticleHtml);
  const h1Count = countMatches(html, /<h1\b/gi);
  const gaScriptCount = countMatches(html, /googletagmanager\.com\/gtag\/js\?id=G-5RND6F4L8G/gi);
  const gaConfigCount = countMatches(html, /gtag\('config',\s*'G-5RND6F4L8G'\)/gi);
  const siteHeaderCount = countMatches(html, /class=["'][^"']*\bsite-header\b/gi);
  const siteFooterCount = countMatches(html, /class=["'][^"']*\bsite-footer\b/gi);
  const blogPosting = /"@type"\s*:\s*"BlogPosting"/.test(html);
  const faqPage = /"@type"\s*:\s*"FAQPage"/.test(html);
  const visibleFaqCount = article.visibleFaqs?.length ?? 0;
  const pageTitle = titleOf(html);
  const pageDescription = metaDescriptionOf(html);
  const pageCanonical = canonicalOf(html);
  const escapedTags = findVisibleEscapedTags(mainArticleHtml);
  item.titleOk = pageTitle === article.title;
  item.canonicalOk = pageCanonical === expectedCanonical;
  item.hasFaqPage = faqPage;

  if (!/^<!doctype html>/i.test(html.trim())) item.errors.push("DOCTYPE ausente.");
  if (!/<html lang="pt-BR">/i.test(html)) item.errors.push("html lang pt-BR ausente.");
  if (!relativeFile.endsWith(".html")) item.errors.push("URL gerada nao preserva .html.");
  if (!pageTitle) item.errors.push("Title ausente.");
  if (!pageDescription) item.errors.push("Meta description ausente.");
  if (!pageCanonical) item.errors.push("Canonical ausente.");
  if (pageCanonical !== expectedCanonical) item.errors.push(`Canonical incorreto: ${pageCanonical} esperado ${expectedCanonical}.`);
  if (pageTitle !== article.title) item.warnings.push("Title no dist diverge do title extraido.");
  if (h1Count !== 1) item.errors.push(`H1 deve ser unico; encontrado ${h1Count}.`);
  if (gaScriptCount !== 1 || gaConfigCount !== 1) item.errors.push(`GA deveria aparecer uma vez; script=${gaScriptCount}, config=${gaConfigCount}.`);
  if (!blogPosting) item.errors.push("BlogPosting ausente.");
  if (visibleFaqCount > 0 && !faqPage) item.errors.push("FAQPage ausente apesar de FAQ visivel.");
  if (html.includes("PLACEHOLDER")) item.errors.push("PLACEHOLDER encontrado.");
  if (!mainArticleHtml || mainText.length < 200) item.errors.push("Conteudo principal vazio ou curto no HTML gerado.");
  if (/site-header|site-footer|G-5RND6F4L8G|googletagmanager\.com/i.test(mainArticleHtml)) item.errors.push("Header, footer ou GA duplicado dentro do conteudo principal.");
  if (siteHeaderCount !== 1) item.errors.push(`Header global duplicado/ausente; encontrado ${siteHeaderCount}.`);
  if (siteFooterCount !== 1) item.errors.push(`Footer global duplicado/ausente; encontrado ${siteFooterCount}.`);
  if (escapedTags.length > 0) item.errors.push(`Tags HTML parecem visiveis como texto: ${escapedTags.join(", ")}.`);

  if (!item.titleOk) {
    titleDivergences.push({ path: relativeFile, legacyTitle: article.title, distTitle: pageTitle });
  }
  if (!item.canonicalOk) {
    canonicalDivergences.push({ path: relativeFile, legacyCanonical: expectedCanonical, distCanonical: pageCanonical });
  }
  if ((article.articleContentWordCount ?? 0) < 900) {
    shortArticles.push({ path: relativeFile, wordCount: article.articleContentWordCount ?? 0 });
  }
  if ((article.risks?.length ?? 0) > 0 || item.warnings.length > 0 || item.errors.length > 0) {
    migrationRiskArticles.push({
      path: relativeFile,
      risks: [...(article.risks ?? []), ...item.warnings, ...item.errors]
    });
  }

  for (const match of html.matchAll(/href="([^"]+)"/g)) {
    const href = match[1];
    const target = normalizeTarget(relativeFile, href);
    if (!target) continue;
    if (target.startsWith("assets/")) continue;
    const targetSlug = slugFromTarget(target);

    if (target.startsWith("articles/") && targetSlug && legacySlugs.has(targetSlug)) {
      item.internalArticleLinksChecked += 1;
      if (!fs.existsSync(path.join(dist, target))) {
        item.internalArticleLinksBroken += 1;
        linkErrors.push({ source: relativeFile, href, target });
      }
      continue;
    }

    if (!fs.existsSync(path.join(dist, target)) && !sitemap.pathSet.has(target) && !fs.existsSync(path.join(root, target))) {
      linkWarnings.push({ source: relativeFile, href, target });
    }
  }

  if (item.errors.length > 0) {
    for (const error of item.errors) {
      errors.push(`${relativeFile}: ${error}`);
    }
  }

  perArticle.push(item);
}

for (const linkError of linkErrors) {
  errors.push(`Link interno entre artigos gerados quebrado em ${linkError.source}: ${linkError.href}`);
}

const generatedMissingInSitemap = legacyArticles
  .filter((article) => !sitemap.pathSet.has(article.originalPath))
  .map((article) => article.originalPath);

const sitemapArticleUrls = sitemap.urls.filter((url) => normalizePath(url).startsWith("articles/"));
const sitemapArticlePathsWithoutGeneratedFile = sitemapArticleUrls
  .map((url) => normalizePath(url))
  .filter((urlPath) => legacyPaths.has(urlPath) && !generatedPaths.has(urlPath));

const articlesMissingInArticlesJson = legacyArticles
  .filter((article) => !articleJsonByPath.has(article.originalPath))
  .map((article) => article.originalPath);

const articlesJsonWithoutGeneratedFile = articlesJson.entries
  .map((entry) => normalizePath(entry.url ?? ""))
  .filter((urlPath) => urlPath.startsWith("articles/") && legacyPaths.has(urlPath) && !generatedPaths.has(urlPath));

const articlesJsonTitleDivergences = [];
const articlesJsonCategoryDivergences = [];
for (const article of legacyArticles) {
  const entry = articleJsonByPath.get(article.originalPath);
  if (!entry) continue;
  if (tokenSimilarity(article.title ?? article.h1 ?? "", entry.title ?? "") < 0.45) {
    articlesJsonTitleDivergences.push({
      path: article.originalPath,
      htmlTitle: article.title,
      jsonTitle: entry.title
    });
  }
  if (article.category && entry.category && normalizeText(article.category) !== normalizeText(entry.category)) {
    articlesJsonCategoryDivergences.push({
      path: article.originalPath,
      htmlCategory: article.category,
      jsonCategory: entry.category
    });
  }
}

const autoFaqCount = legacyArticles.filter((article) => (article.visibleFaqs?.length ?? 0) > 0).length;
const generatedFaqCount = perArticle.filter((item) => item.hasFaqPage).length;
const totalPreservedLinks = legacyArticles.reduce((total, article) => total + (article.internalLinks?.length ?? 0), 0);

function addList(lines, items, emptyText, formatter = (item) => `- \`${item}\``) {
  if (!items || items.length === 0) {
    lines.push(`- ${emptyText}`);
    return;
  }
  for (const item of items) {
    lines.push(formatter(item));
  }
}

const lines = [];
lines.push("# Relatorio Astro dos 151 artigos legados");
lines.push("");
lines.push(`Gerado em: \`${new Date().toISOString()}\``);
lines.push("Escopo: validacao dos artigos legados renderizados em Astro a partir de `src/data/legacy-extract/legacy-articles.json`.");
lines.push("");
lines.push("## Resumo");
lines.push("");
lines.push(`- Artigos no JSON legado: ${legacyArticles.length}`);
lines.push(`- Arquivos HTML de artigos gerados em dist: ${generatedArticleFiles.length}`);
lines.push(`- FAQPage automatico em artigos com FAQ visivel: ${generatedFaqCount}/${autoFaqCount}`);
lines.push(`- Links internos preservados no conteudo legado: ${totalPreservedLinks}`);
lines.push(`- Divergencias de title legado x dist: ${titleDivergences.length}`);
lines.push(`- Divergencias de canonical legado x dist: ${canonicalDivergences.length}`);
lines.push(`- Divergencias com sitemap: ${generatedMissingInSitemap.length + sitemapArticlePathsWithoutGeneratedFile.length + sitemap.duplicates.length}`);
lines.push(`- Divergencias com articles.json: ${articlesMissingInArticlesJson.length + articlesJsonWithoutGeneratedFile.length + articlesJsonTitleDivergences.length + articlesJsonCategoryDivergences.length}`);
lines.push(`- Artigos com conteudo curto abaixo de 900 palavras: ${shortArticles.length}`);
lines.push(`- Artigos com possivel risco visual/tecnico: ${migrationRiskArticles.length}`);
lines.push(`- Links internos entre artigos gerados quebrados: ${linkErrors.length}`);
lines.push(`- Avisos de links para paginas fora do dist/sitemap: ${linkWarnings.length}`);
lines.push(`- Erros criticos: ${errors.length}`);
lines.push("");

lines.push("## Divergencias de title legado x dist");
addList(lines, titleDivergences, "Nenhuma.", (item) => `- \`${item.path}\`: legado="${item.legacyTitle}" | dist="${item.distTitle}"`);
lines.push("");

lines.push("## Divergencias de canonical legado x dist");
addList(lines, canonicalDivergences, "Nenhuma.", (item) => `- \`${item.path}\`: legado="${item.legacyCanonical}" | dist="${item.distCanonical}"`);
lines.push("");

lines.push("## Divergencias com sitemap");
lines.push("");
lines.push(`- Sitemap encontrado: ${sitemap.exists ? "sim" : "nao"}`);
lines.push(`- URLs totais no sitemap: ${sitemap.urls.length}`);
lines.push(`- URLs de artigos no sitemap: ${sitemapArticleUrls.length}`);
lines.push("");
lines.push("### Artigos gerados ausentes no sitemap");
addList(lines, generatedMissingInSitemap, "Nenhum.");
lines.push("");
lines.push("### URLs do sitemap sem arquivo gerado");
addList(lines, sitemapArticlePathsWithoutGeneratedFile, "Nenhuma.");
lines.push("");
lines.push("### Duplicatas no sitemap");
addList(lines, sitemap.duplicates, "Nenhuma.", (item) => `- \`${item.url}\`: ${item.count} vezes`);
lines.push("");

lines.push("## Divergencias com articles.json");
lines.push("");
lines.push(`- articles.json encontrado: ${articlesJson.exists ? "sim" : "nao"}`);
lines.push(`- Entradas em articles.json: ${articlesJson.entries.length}`);
lines.push("");
lines.push("### Artigos gerados ausentes no articles.json");
addList(lines, articlesMissingInArticlesJson, "Nenhum.");
lines.push("");
lines.push("### Entradas do articles.json sem arquivo gerado");
addList(lines, articlesJsonWithoutGeneratedFile, "Nenhuma.");
lines.push("");
lines.push("### Divergencias fortes de titulo em articles.json");
addList(lines, articlesJsonTitleDivergences, "Nenhuma.", (item) => `- \`${item.path}\`: HTML="${item.htmlTitle}" | JSON="${item.jsonTitle}"`);
lines.push("");
lines.push("### Divergencias de categoria em articles.json");
addList(lines, articlesJsonCategoryDivergences, "Nenhuma.", (item) => `- \`${item.path}\`: HTML="${item.htmlCategory}" | JSON="${item.jsonCategory}"`);
lines.push("");

lines.push("## Artigos com conteudo curto abaixo de 900 palavras");
addList(lines, shortArticles, "Nenhum.", (item) => `- \`${item.path}\`: ${item.wordCount} palavras extraidas`);
lines.push("");

lines.push("## Artigos com possivel risco visual/tecnico");
addList(lines, migrationRiskArticles, "Nenhum.", (item) => `- \`${item.path}\`: ${item.risks.join(" | ")}`);
lines.push("");

lines.push("## Links internos");
lines.push("");
lines.push("### Links internos entre artigos gerados quebrados");
addList(lines, linkErrors, "Nenhum.", (item) => `- \`${item.source}\` -> \`${item.href}\``);
lines.push("");
lines.push("### Avisos de links fora do dist/sitemap");
addList(lines, linkWarnings, "Nenhum.", (item) => `- \`${item.source}\` -> \`${item.href}\` (normalizado: \`${item.target}\`)`);
lines.push("");

lines.push("## Recomendacao para proxima fase");
lines.push("");
if (errors.length === 0) {
  lines.push("Os 151 artigos legados foram gerados em Astro com URLs `.html`, title, meta description, canonical, H1 unico, GA unico, BlogPosting e FAQPage automatico quando havia FAQ visivel. Nao ha bloqueio tecnico para preparar a migracao completa das categorias e do blog.");
  lines.push("Antes de qualquer merge em `main`, a proxima fase deve migrar/gerar `blog.html`, paginas de categorias e sitemap em Astro, depois executar uma comparacao final de inventario e uma revisao visual manual em paginas representativas.");
} else {
  lines.push("Corrigir os erros criticos listados antes de preparar migracao completa das categorias e do blog.");
}

fs.writeFileSync(reportPath, `${lines.join("\n").replace(/\n+$/, "")}\n`, "utf8");

if (errors.length > 0) {
  console.error(errors.slice(0, 200).join("\n"));
  if (errors.length > 200) {
    console.error(`... ${errors.length - 200} erros adicionais omitidos no console.`);
  }
  console.error(`Relatorio: ${path.relative(root, reportPath).replaceAll("\\", "/")}`);
  process.exit(1);
}

console.log(`Astro all-articles validado: ${legacyArticles.length} artigos, 0 erros criticos.`);
console.log(`Relatorio: ${path.relative(root, reportPath).replaceAll("\\", "/")}`);
