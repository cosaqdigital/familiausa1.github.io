import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const dist = path.join(root, "dist");
const legacyPath = path.join(root, "src", "data", "legacy-extract", "legacy-articles.json");
const reportsDir = path.join(root, "src", "data", "legacy-extract");
const currentSitemapPath = path.join(root, "sitemap.xml");
const astroSitemapPath = path.join(dist, "sitemap.xml");
const categoriesDir = path.join(root, "categorias");
const markdownArticlesDir = path.join(root, "src", "content", "articles");
const siteUrl = "https://familiausa1.com";

const sitemapReportPath = path.join(reportsDir, "astro-sitemap-comparison-report.md");
const structureReportPath = path.join(reportsDir, "astro-site-structure-report.md");

const rootPages = [
  "index.html",
  "blog.html",
  "categorias.html",
  "checklist-mudanca-eua.html",
  "comece-aqui.html",
  "empreendedorismo-nos-estados-unidos.html",
  "empreender-nos-estados-unidos-guia-completo.html",
  "sobre.html",
  "contato.html",
  "politica-de-privacidade.html",
  "politica-de-cookies.html",
  "termos-de-uso.html"
];

const errors = [];
const warnings = [];

function toPosix(value) {
  return String(value).replaceAll("\\", "/");
}

function readText(filePath) {
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : "";
}

function stripTags(value = "") {
  return String(value)
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function countMatches(value, pattern) {
  return [...String(value).matchAll(pattern)].length;
}

function parseSitemap(filePath) {
  const xml = readText(filePath);
  const urls = [...xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi)].map((match) => match[1].trim());
  const counts = new Map();
  for (const url of urls) {
    counts.set(url, (counts.get(url) ?? 0) + 1);
  }

  return {
    exists: Boolean(xml),
    xml,
    urls,
    duplicates: [...counts.entries()].filter(([, count]) => count > 1).map(([url, count]) => ({ url, count })),
    set: new Set(urls)
  };
}

function normalizeUrlToPath(value = "") {
  let target = String(value).trim();
  target = target.replace(/^https?:\/\/familiausa1\.com\/?/i, "");
  target = target.replace(/^\/+/, "");
  target = target.replace(/[?#].*$/, "");
  if (!target) return "index.html";
  if (target.endsWith("/")) return `${target}index.html`;
  return target;
}

function canonicalForPath(relativePath) {
  if (relativePath === "index.html") return `${siteUrl}/`;
  return `${siteUrl}/${relativePath}`;
}

function canonicalOf(html) {
  return html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i)?.[1]?.trim() ?? null;
}

function titleOf(html) {
  return html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim() ?? null;
}

function metaDescriptionOf(html) {
  return html.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i)?.[1]?.trim() ?? null;
}

function extractMainContent(html) {
  return html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1]?.trim() ?? "";
}

function listGeneratedHtml() {
  if (!fs.existsSync(dist)) return [];
  return fs.readdirSync(dist, { recursive: true })
    .map((file) => toPosix(file))
    .filter((file) => file.endsWith(".html"))
    .sort();
}

function sourceCategorySlugs() {
  if (!fs.existsSync(categoriesDir)) return [];
  return fs.readdirSync(categoriesDir)
    .filter((file) => file.endsWith(".html"))
    .map((file) => file.replace(/\.html$/, ""))
    .sort();
}

function scalar(frontmatter, key) {
  const match = frontmatter.match(new RegExp(`^${key}:\\s*(.+)$`, "m"));
  return match ? match[1].trim().replace(/^['"]|['"]$/g, "").trim() : "";
}

function markdownArticleEntries() {
  if (!fs.existsSync(markdownArticlesDir)) return [];

  return fs.readdirSync(markdownArticlesDir)
    .filter((file) => file.endsWith(".md") && !file.startsWith("_"))
    .map((file) => {
      const markdown = fs.readFileSync(path.join(markdownArticlesDir, file), "utf8");
      const frontmatter = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? "";
      const draft = scalar(frontmatter, "draft");
      const slug = scalar(frontmatter, "slug") || file.replace(/\.md$/, "");
      return {
        slug,
        path: `articles/${slug}.html`,
        canonical: `${siteUrl}/articles/${slug}.html`,
        draft
      };
    })
    .filter((entry) => entry.draft === "false")
    .sort((left, right) => left.path.localeCompare(right.path));
}

function hrefTargets(html, currentFile) {
  const currentDir = path.posix.dirname(currentFile);
  return [...html.matchAll(/\bhref=["']([^"']+)["']/gi)]
    .map((match) => match[1])
    .filter((href) => href && !/^(mailto:|tel:|#|javascript:)/i.test(href))
    .map((href) => {
      if (/^https?:\/\//i.test(href) && !/^https?:\/\/familiausa1\.com\/?/i.test(href)) {
        return null;
      }

      const clean = href.replace(/^https?:\/\/familiausa1\.com\/?/i, "/").replace(/[?#].*$/, "");
      if (!clean || clean === "/") return "index.html";
      if (clean.startsWith("/")) return normalizeUrlToPath(clean);
      return normalizeUrlToPath(path.posix.normalize(path.posix.join(currentDir === "." ? "" : currentDir, clean)));
    })
    .filter(Boolean);
}

function writeReport(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, "utf8");
}

function bulletList(items, emptyText = "Nenhum item encontrado.") {
  return items.length ? items.map((item) => `- ${item}`).join("\n") : `- ${emptyText}`;
}

const legacy = JSON.parse(fs.readFileSync(legacyPath, "utf8"));
const legacyArticles = legacy.articles ?? [];
const markdownArticles = markdownArticleEntries();
const articlePaths = [
  ...legacyArticles.map((article) => `articles/${article.slug}.html`),
  ...markdownArticles.map((article) => article.path)
].sort();
const markdownCanonicalSet = new Set(markdownArticles.map((article) => article.canonical));
const categorySlugs = sourceCategorySlugs();
const categoryPaths = categorySlugs.map((slug) => `categorias/${slug}.html`);
const expectedPaths = [...rootPages, ...categoryPaths, ...articlePaths];
const expectedPathSet = new Set(expectedPaths);
const generatedHtml = listGeneratedHtml();
const generatedPathSet = new Set(generatedHtml);
const currentSitemap = parseSitemap(currentSitemapPath);
const astroSitemap = parseSitemap(astroSitemapPath);
const currentSitemapPathSet = new Set(currentSitemap.urls.map(normalizeUrlToPath));
const astroSitemapPathSet = new Set(astroSitemap.urls.map(normalizeUrlToPath));

if (!fs.existsSync(dist)) {
  errors.push("dist/ nao encontrado. Rode npm run build antes da validacao.");
}

if (!astroSitemap.exists) {
  errors.push("dist/sitemap.xml nao foi gerado.");
}

for (const expectedPath of expectedPaths) {
  if (!generatedPathSet.has(expectedPath)) {
    errors.push(`Arquivo esperado nao gerado em dist: ${expectedPath}`);
  }
}

const extraGeneratedHtml = generatedHtml.filter((file) => !expectedPathSet.has(file));
if (extraGeneratedHtml.length > 0) {
  warnings.push(`Arquivos HTML extras gerados: ${extraGeneratedHtml.join(", ")}`);
}

if (categoryPaths.length !== 20) {
  warnings.push(`Quantidade de categorias fonte diferente de 20: ${categoryPaths.length}.`);
}

const pageResults = [];
let categoryCollectionPages = 0;
let categoryBreadcrumbs = 0;
let articleBlogPostings = 0;
let articleFaqPages = 0;
let totalInternalLinksChecked = 0;
let linkWarnings = [];
let linkErrors = [];

for (const relativePath of expectedPaths) {
  const fullPath = path.join(dist, relativePath);
  if (!fs.existsSync(fullPath)) continue;

  const html = fs.readFileSync(fullPath, "utf8");
  const canonical = canonicalOf(html);
  const expectedCanonical = relativePath.startsWith("articles/")
    ? legacyArticles.find((article) => `articles/${article.slug}.html` === relativePath)?.canonical
      ?? markdownArticles.find((article) => article.path === relativePath)?.canonical
      ?? canonicalForPath(relativePath)
    : canonicalForPath(relativePath);
  const isArticle = relativePath.startsWith("articles/");
  const isCategory = relativePath.startsWith("categorias/");
  const article = isArticle ? legacyArticles.find((item) => `articles/${item.slug}.html` === relativePath) : null;
  const localErrors = [];
  const localWarnings = [];
  const h1Count = countMatches(html, /<h1\b/gi);
  const gaScriptCount = countMatches(html, /googletagmanager\.com\/gtag\/js\?id=G-5RND6F4L8G/gi);
  const gaConfigCount = countMatches(html, /gtag\('config',\s*'G-5RND6F4L8G'\)/gi);
  const hasCollectionPage = /"@type"\s*:\s*"CollectionPage"/.test(html);
  const hasBreadcrumb = /"@type"\s*:\s*"BreadcrumbList"/.test(html);
  const hasBlogPosting = /"@type"\s*:\s*"BlogPosting"/.test(html);
  const hasFaqPage = /"@type"\s*:\s*"FAQPage"/.test(html);
  const mainTextLength = stripTags(extractMainContent(html)).length;

  if (!/^<!doctype html>/i.test(html.trim())) localErrors.push("DOCTYPE ausente.");
  if (!/<html lang=["']pt-BR["']>/i.test(html)) localErrors.push("html lang pt-BR ausente.");
  if (!titleOf(html)) localErrors.push("title ausente.");
  if (!metaDescriptionOf(html)) localErrors.push("meta description ausente.");
  if (!canonical) localErrors.push("canonical ausente.");
  if (canonical !== expectedCanonical) localErrors.push(`canonical incorreto: ${canonical} esperado ${expectedCanonical}.`);
  if (h1Count !== 1) localErrors.push(`H1 deve ser unico; encontrado ${h1Count}.`);
  if (gaScriptCount !== 1 || gaConfigCount !== 1) localErrors.push(`GA deve aparecer uma vez; script=${gaScriptCount}, config=${gaConfigCount}.`);
  if (!html.includes("<header class=\"site-header\"")) localErrors.push("header global ausente.");
  if (!html.includes("<footer class=\"site-footer\"")) localErrors.push("footer global ausente.");
  if (html.includes("PLACEHOLDER")) localErrors.push("PLACEHOLDER encontrado.");
  if (mainTextLength < 400) localWarnings.push("conteudo principal parece curto para pagina editorial.");

  if (isCategory) {
    if (!hasCollectionPage) localErrors.push("CollectionPage ausente na categoria.");
    if (!hasBreadcrumb) localErrors.push("BreadcrumbList ausente na categoria.");
    if (hasCollectionPage) categoryCollectionPages += 1;
    if (hasBreadcrumb) categoryBreadcrumbs += 1;
    const categoryArticleLinks = [...html.matchAll(/href=["']\/articles\/([^"']+\.html)["']/gi)].length;
    if (categoryArticleLinks === 0) localWarnings.push("categoria sem links visiveis para artigos.");
  }

  if (isArticle) {
    if (!hasBlogPosting) localErrors.push("BlogPosting ausente no artigo.");
    if ((article?.visibleFaqs?.length ?? 0) > 0 && !hasFaqPage) localErrors.push("FAQPage ausente apesar de FAQ visivel no legado.");
    if (hasBlogPosting) articleBlogPostings += 1;
    if (hasFaqPage) articleFaqPages += 1;
  }

  for (const target of hrefTargets(html, relativePath)) {
    if (target.startsWith("assets/")) {
      if (!fs.existsSync(path.join(dist, target))) {
        linkWarnings.push(`${relativePath}: asset linkado nao existe em dist (${target}).`);
      }
      continue;
    }

    if (!target.endsWith(".html")) {
      continue;
    }

    totalInternalLinksChecked += 1;
    if (generatedPathSet.has(target) && fs.existsSync(path.join(dist, target))) {
      continue;
    }

    if (currentSitemapPathSet.has(target)) {
      linkWarnings.push(`${relativePath}: link aponta para URL do sitemap atual ainda nao gerada em dist (${target}).`);
      continue;
    }

    if (expectedPathSet.has(target)) {
      linkErrors.push(`${relativePath}: link interno esperado nao encontrado em dist (${target}).`);
      continue;
    }

    linkWarnings.push(`${relativePath}: link interno fora do sitemap atual ou nao migrado (${target}).`);
  }

  if (localErrors.length > 0) {
    errors.push(...localErrors.map((message) => `${relativePath}: ${message}`));
  }
  warnings.push(...localWarnings.map((message) => `${relativePath}: ${message}`));
  pageResults.push({ relativePath, localErrors, localWarnings });
}

errors.push(...linkErrors);
warnings.push(...linkWarnings);

const currentOnlyUrls = currentSitemap.urls.filter((url) => !astroSitemap.set.has(url));
const astroOnlyUrls = astroSitemap.urls.filter((url) => !currentSitemap.set.has(url));
const allowedNewMarkdownUrls = astroOnlyUrls.filter((url) => markdownCanonicalSet.has(url));
const rootPageCanonicalSet = new Set(rootPages.map(canonicalForPath));
const allowedNewRootPageUrls = astroOnlyUrls.filter((url) => rootPageCanonicalSet.has(url));
const unexpectedAstroOnlyUrls = astroOnlyUrls.filter((url) => !markdownCanonicalSet.has(url) && !rootPageCanonicalSet.has(url));
const expectedArticleCanonicals = [
  ...legacyArticles.map((article) => article.canonical),
  ...markdownArticles.map((article) => article.canonical)
];
const missingArticleUrls = expectedArticleCanonicals
  .filter((url) => !astroSitemap.set.has(url));
const missingCategoryUrls = categoryPaths
  .map((relativePath) => canonicalForPath(relativePath))
  .filter((url) => !astroSitemap.set.has(url));
const missingRootUrls = rootPages
  .map(canonicalForPath)
  .filter((url) => !astroSitemap.set.has(url));

if (astroSitemap.duplicates.length > 0) {
  errors.push(`Sitemap Astro tem URLs duplicadas: ${astroSitemap.duplicates.map((item) => `${item.url} (${item.count})`).join(", ")}`);
}
if (astroSitemap.urls.length !== expectedPaths.length) {
  errors.push(`Sitemap Astro deveria ter ${expectedPaths.length} URLs; encontrou ${astroSitemap.urls.length}.`);
}
if (missingArticleUrls.length > 0) {
  errors.push(`Sitemap Astro nao contem todos os artigos: ${missingArticleUrls.length} ausentes.`);
}
if (missingCategoryUrls.length > 0) {
  errors.push(`Sitemap Astro nao contem todas as categorias: ${missingCategoryUrls.length} ausentes.`);
}
if (missingRootUrls.length > 0) {
  errors.push(`Sitemap Astro nao contem todas as paginas principais: ${missingRootUrls.length} ausentes.`);
}

const currentVsAstroUrlSetMatches = currentOnlyUrls.length === 0 && unexpectedAstroOnlyUrls.length === 0;
if (!currentVsAstroUrlSetMatches) {
  errors.push(`Sitemap Astro diverge do sitemap atual: ${currentOnlyUrls.length} URLs faltando e ${unexpectedAstroOnlyUrls.length} URLs extras inesperadas.`);
}

const sitemapReport = `# Comparacao de sitemap Astro

Data da validacao: ${new Date().toISOString()}

## Resumo

- URLs no sitemap atual: ${currentSitemap.urls.length}
- URLs no sitemap Astro: ${astroSitemap.urls.length}
- Artigos legados esperados: ${legacyArticles.length}
- Artigos Markdown publicados: ${markdownArticles.length}
- Artigos totais esperados: ${articlePaths.length}
- Categorias esperadas: ${categoryPaths.length}
- Paginas principais esperadas: ${rootPages.length}
- Duplicatas no sitemap atual: ${currentSitemap.duplicates.length}
- Duplicatas no sitemap Astro: ${astroSitemap.duplicates.length}
- URL set atual preservado no Astro: ${currentOnlyUrls.length === 0 ? "sim" : "nao"}
- URLs extras permitidas por Markdown: ${allowedNewMarkdownUrls.length}
- URLs extras permitidas por paginas principais: ${allowedNewRootPageUrls.length}

## URLs faltando no Astro

${bulletList(currentOnlyUrls)}

## URLs extras no Astro

${bulletList(astroOnlyUrls)}

## URLs extras permitidas por Markdown

${bulletList(allowedNewMarkdownUrls)}

## URLs extras permitidas por paginas principais

${bulletList(allowedNewRootPageUrls)}

## URLs extras inesperadas

${bulletList(unexpectedAstroOnlyUrls)}

## Artigos ausentes no sitemap Astro

${bulletList(missingArticleUrls)}

## Categorias ausentes no sitemap Astro

${bulletList(missingCategoryUrls)}

## Paginas principais ausentes no sitemap Astro

${bulletList(missingRootUrls)}

## Recomendacao

${currentVsAstroUrlSetMatches && astroSitemap.duplicates.length === 0 ? "O sitemap gerado pelo Astro preserva o conjunto de URLs atual e permite crescimento futuro via artigos Markdown validados." : "Corrigir divergencias antes de qualquer merge para main."}
`;

const pagesWithErrors = pageResults.filter((item) => item.localErrors.length > 0);
const pagesWithWarnings = pageResults.filter((item) => item.localWarnings.length > 0);
const structureReport = `# Relatorio de estrutura editorial Astro

Data da validacao: ${new Date().toISOString()}

## Resumo

- HTMLs gerados em dist: ${generatedHtml.length}
- Paginas esperadas: ${expectedPaths.length}
- Paginas principais esperadas: ${rootPages.length}
- Categorias geradas/esperadas: ${categoryPaths.filter((file) => generatedPathSet.has(file)).length}/${categoryPaths.length}
- Artigos legados esperados: ${legacyArticles.length}
- Artigos Markdown publicados: ${markdownArticles.length}
- Artigos gerados/esperados: ${articlePaths.filter((file) => generatedPathSet.has(file)).length}/${articlePaths.length}
- Categorias com CollectionPage: ${categoryCollectionPages}/${categoryPaths.length}
- Categorias com BreadcrumbList: ${categoryBreadcrumbs}/${categoryPaths.length}
- Artigos com BlogPosting: ${articleBlogPostings}/${articlePaths.length}
- Artigos com FAQPage: ${articleFaqPages}
- Links internos analisados: ${totalInternalLinksChecked}
- Erros: ${errors.length}
- Avisos: ${warnings.length}

## Paginas principais

${bulletList(rootPages.map((file) => `${file}: ${generatedPathSet.has(file) ? "gerada" : "ausente"}`))}

## Categorias

${bulletList(categoryPaths.map((file) => `${file}: ${generatedPathSet.has(file) ? "gerada" : "ausente"}`))}

## Problemas criticos

${bulletList(errors)}

## Avisos

${bulletList(warnings)}

## Paginas com erros locais

${bulletList(pagesWithErrors.map((item) => `${item.relativePath}: ${item.localErrors.join(" | ")}`))}

## Paginas com avisos locais

${bulletList(pagesWithWarnings.map((item) => `${item.relativePath}: ${item.localWarnings.join(" | ")}`))}

## Recomendacao

${errors.length === 0 ? "A estrutura editorial Astro esta segura para a proxima etapa: validacao visual das categorias e preparacao de migracao completa de blog/categorias." : "Corrigir os erros acima antes de ampliar a migracao ou considerar merge futuro."}
`;

writeReport(sitemapReportPath, sitemapReport);
writeReport(structureReportPath, structureReport);

if (errors.length > 0) {
  console.error(errors.join("\n"));
  console.error(`\nRelatorios gerados:\n- ${sitemapReportPath}\n- ${structureReportPath}`);
  process.exit(1);
}

console.log(`Estrutura Astro validada: ${expectedPaths.length} paginas, ${legacyArticles.length} artigos legados, ${markdownArticles.length} artigos Markdown, ${categoryPaths.length} categorias, ${totalInternalLinksChecked} links internos analisados.`);
console.log(`Relatorios gerados:\n- ${sitemapReportPath}\n- ${structureReportPath}`);
