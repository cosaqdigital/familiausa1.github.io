import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const articlesDir = path.join(root, "articles");
const outputDir = path.join(root, "src", "data", "legacy-extract");
const articlesJsonPath = path.join(root, "assets", "data", "articles.json");
const sitemapPath = path.join(root, "sitemap.xml");
const siteUrl = "https://familiausa1.com";

const pilotArticles = [
  "articles/custo-de-vida-nos-eua-2026-atualizado.html",
  "articles/morar-legalmente-nos-eua-caminhos-possiveis-2026.html",
  "articles/asilo-nos-estados-unidos-2026.html",
  "articles/morar-em-boston-2026.html",
  "articles/cidades-da-florida-com-mais-brasileiros-2026.html",
  "articles/formas-legais-conseguir-green-card-eua-2026.html",
  "articles/guia-completo-visto-americano-2026.html",
  "articles/quanto-custa-morar-em-orlando-2026.html",
  "articles/trabalhar-sem-autorizacao-nos-eua-riscos-2026.html",
  "articles/morar-em-framingham-massachusetts-2026.html"
];

const hasPilot = process.argv.includes("--pilot");
const hasAll = process.argv.includes("--all");

if (hasPilot === hasAll) {
  console.error("Uso: node scripts/extract-legacy-articles.mjs --pilot|--all");
  process.exit(1);
}

const mode = hasAll ? "all" : "pilot";
const outputJson = mode === "pilot" ? "pilot-articles.json" : "legacy-articles.json";
const outputReport = mode === "pilot" ? "pilot-report.md" : "legacy-report.md";

function toPosix(filePath) {
  return filePath.replaceAll("\\", "/");
}

function normalizePath(value = "") {
  return toPosix(value)
    .replace(/^https?:\/\/familiausa1\.com\/?/i, "")
    .replace(/^\/+/, "")
    .replace(/#.*$/, "")
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

function decodeEntities(value = "") {
  const entities = {
    amp: "&",
    lt: "<",
    gt: ">",
    quot: "\"",
    apos: "'",
    nbsp: " "
  };

  return value
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([\da-f]+);/gi, (_, code) => String.fromCharCode(Number.parseInt(code, 16)))
    .replace(/&([a-z]+);/gi, (_, entity) => entities[entity.toLowerCase()] ?? `&${entity};`);
}

function stripTags(value = "") {
  return decodeEntities(value)
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseAttrs(tag = "") {
  const attrs = {};
  for (const match of tag.matchAll(/([\w:-]+)\s*=\s*(["'])([\s\S]*?)\2/g)) {
    attrs[match[1].toLowerCase()] = decodeEntities(match[3].trim());
  }
  return attrs;
}

function findTagContent(html, tagName) {
  const pattern = new RegExp(`<${tagName}\\b[^>]*>([\\s\\S]*?)<\\/${tagName}>`, "i");
  const match = html.match(pattern);
  return match ? stripTags(match[1]) : null;
}

function findMeta(html, key) {
  for (const match of html.matchAll(/<meta\b[^>]*>/gi)) {
    const attrs = parseAttrs(match[0]);
    if ((attrs.name === key || attrs.property === key) && attrs.content !== undefined) {
      return attrs.content.trim();
    }
  }
  return null;
}

function findCanonical(html) {
  for (const match of html.matchAll(/<link\b[^>]*>/gi)) {
    const attrs = parseAttrs(match[0]);
    const rel = (attrs.rel ?? "").toLowerCase().split(/\s+/);
    if (rel.includes("canonical") && attrs.href) {
      return attrs.href.trim();
    }
  }
  return null;
}

function findClassContent(html, className) {
  const pattern = new RegExp(`<[^>]+class=["'][^"']*\\b${className}\\b[^"']*["'][^>]*>([\\s\\S]*?)<\\/[^>]+>`, "i");
  const match = html.match(pattern);
  return match ? stripTags(match[1]) : null;
}

function extractJsonLd(html) {
  const blocks = [];

  for (const match of html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    const raw = match[1].trim();
    try {
      blocks.push({
        valid: true,
        data: JSON.parse(raw),
        raw
      });
    } catch (error) {
      blocks.push({
        valid: false,
        error: error.message,
        raw
      });
    }
  }

  return blocks;
}

function schemaType(schema) {
  if (!schema || typeof schema !== "object") return null;
  return Array.isArray(schema["@type"]) ? schema["@type"][0] : schema["@type"];
}

function collectSchemasByType(jsonLdBlocks, type) {
  const found = [];

  function visit(node) {
    if (!node || typeof node !== "object") return;
    if (Array.isArray(node)) {
      node.forEach(visit);
      return;
    }
    if (schemaType(node) === type) {
      found.push(node);
    }
    if (Array.isArray(node["@graph"])) {
      node["@graph"].forEach(visit);
    }
  }

  for (const block of jsonLdBlocks) {
    if (block.valid) {
      visit(block.data);
    }
  }

  return found;
}

function extractArticleContent(html) {
  const startMatch = html.match(/<section\b[^>]*class=["'][^"']*\barticle-content\b[^"']*["'][^>]*>/i);
  if (!startMatch || startMatch.index === undefined) {
    const mainMatch = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i);
    return mainMatch ? mainMatch[1].trim() : null;
  }

  const contentStart = startMatch.index + startMatch[0].length;
  const afterStart = html.slice(contentStart);
  const closeBeforeMain = afterStart.match(/<\/section>\s*<\/main>/i);

  if (closeBeforeMain && closeBeforeMain.index !== undefined) {
    return afterStart.slice(0, closeBeforeMain.index).trim();
  }

  const firstClose = afterStart.indexOf("</section>");
  if (firstClose >= 0) {
    return afterStart.slice(0, firstClose).trim();
  }

  return afterStart.trim();
}

function extractVisibleFaqs(html, articleContent = "") {
  const faqBlocks = [];

  for (const match of html.matchAll(/<section\b[^>]*class=["'][^"']*\bfaq-section\b[^"']*["'][^>]*>([\s\S]*?)<\/section>/gi)) {
    faqBlocks.push(match[1]);
  }

  if (faqBlocks.length === 0 && /Perguntas frequentes/i.test(articleContent)) {
    const faqStart = articleContent.search(/<h2[^>]*>\s*Perguntas frequentes[\s\S]*?<\/h2>/i);
    if (faqStart >= 0) {
      faqBlocks.push(articleContent.slice(faqStart));
    }
  }

  const faqs = [];
  const seen = new Set();

  for (const block of faqBlocks) {
    for (const match of block.matchAll(/<h3\b[^>]*>([\s\S]*?)<\/h3>\s*<p\b[^>]*>([\s\S]*?)<\/p>/gi)) {
      const question = stripTags(match[1]);
      const answer = stripTags(match[2]);
      const key = `${question}::${answer}`;
      if (question && answer && !seen.has(key)) {
        seen.add(key);
        faqs.push({ question, answer });
      }
    }
  }

  return faqs;
}

function extractInternalLinks(html) {
  const links = [];
  const seen = new Set();

  for (const match of html.matchAll(/<a\b[^>]*href=(["'])([\s\S]*?)\1[^>]*>/gi)) {
    const href = decodeEntities(match[2].trim());
    if (!href || /^(https?:|mailto:|tel:|#)/i.test(href)) continue;
    if (href.startsWith("javascript:")) continue;
    if (href.startsWith("../assets/") || href.startsWith("assets/")) continue;

    const closeIndex = html.indexOf("</a>", match.index ?? 0);
    const anchor = closeIndex >= 0
      ? stripTags(html.slice(match.index ?? 0, closeIndex + 4))
      : "";
    const cleanHref = href.replace(/#.*$/, "");
    const key = `${cleanHref}::${anchor}`;

    if (!seen.has(key)) {
      seen.add(key);
      links.push({ href, anchor });
    }
  }

  return links;
}

function firstSchemaValue(schema, field) {
  if (!schema || typeof schema !== "object") return null;
  const value = schema[field];
  if (value === undefined || value === null || value === "") return null;
  return value;
}

function extractDates(html, blogPosting) {
  const datePublished =
    firstSchemaValue(blogPosting, "datePublished") ??
    (html.match(/"datePublished"\s*:\s*"([^"]+)"/i)?.[1] ?? null);
  const dateModified =
    firstSchemaValue(blogPosting, "dateModified") ??
    (html.match(/"dateModified"\s*:\s*"([^"]+)"/i)?.[1] ?? null);

  return { datePublished, dateModified };
}

function extractArticle(relativePath) {
  const fullPath = path.join(root, relativePath);
  const html = fs.readFileSync(fullPath, "utf8");
  const slug = path.basename(relativePath, ".html");
  const expectedUrl = `${siteUrl}/${toPosix(relativePath)}`;
  const jsonLdBlocks = extractJsonLd(html);
  const blogPosting = collectSchemasByType(jsonLdBlocks, "BlogPosting")[0] ?? null;
  const faqPage = collectSchemasByType(jsonLdBlocks, "FAQPage")[0] ?? null;
  const articleContent = extractArticleContent(html);
  const visibleFaqs = extractVisibleFaqs(html, articleContent ?? "");
  const { datePublished, dateModified } = extractDates(html, blogPosting);
  const title = findTagContent(html, "title");
  const metaDescription = findMeta(html, "description");
  const canonical = findCanonical(html);
  const internalLinks = extractInternalLinks(html);
  const wordCount = articleContent ? stripTags(articleContent).split(/\s+/).filter(Boolean).length : 0;

  const article = {
    originalPath: toPosix(relativePath),
    slug,
    expectedUrl,
    title,
    metaDescription,
    canonical,
    openGraph: {
      title: findMeta(html, "og:title"),
      description: findMeta(html, "og:description"),
      image: findMeta(html, "og:image")
    },
    twitter: {
      title: findMeta(html, "twitter:title"),
      description: findMeta(html, "twitter:description")
    },
    h1: findTagContent(html, "h1"),
    category: findClassContent(html, "eyebrow"),
    datePublished,
    dateModified,
    readingTime: html.match(/(\d+\s*min(?:utos?)?\s+de\s+leitura)/i)?.[1] ?? null,
    schemas: {
      jsonLdBlockCount: jsonLdBlocks.length,
      invalidJsonLd: jsonLdBlocks.filter((block) => !block.valid).map((block) => block.error),
      blogPosting,
      faqPage,
      hasBlogPosting: Boolean(blogPosting),
      hasFAQPage: Boolean(faqPage)
    },
    visibleFaqs,
    articleContentHtml: articleContent,
    articleContentTextSample: articleContent ? stripTags(articleContent).slice(0, 500) : null,
    articleContentWordCount: wordCount,
    internalLinks,
    technicalPresence: {
      hasGoogleAnalytics: html.includes("G-5RND6F4L8G"),
      hasSiteHeader: /<header\b[^>]*class=["'][^"']*\bsite-header\b/i.test(html),
      hasSiteFooter: /<footer\b[^>]*class=["'][^"']*\bsite-footer\b/i.test(html)
    }
  };

  article.missingFields = [
    ["title", article.title],
    ["metaDescription", article.metaDescription],
    ["canonical", article.canonical],
    ["og:title", article.openGraph.title],
    ["og:description", article.openGraph.description],
    ["og:image", article.openGraph.image],
    ["twitter:title", article.twitter.title],
    ["twitter:description", article.twitter.description],
    ["h1", article.h1],
    ["category", article.category],
    ["datePublished", article.datePublished],
    ["dateModified", article.dateModified],
    ["readingTime", article.readingTime],
    ["BlogPosting schema", article.schemas.hasBlogPosting],
    ["FAQPage schema", article.schemas.hasFAQPage],
    ["visible FAQ", article.visibleFaqs.length > 0],
    ["articleContent", article.articleContentHtml],
    ["Google Analytics", article.technicalPresence.hasGoogleAnalytics],
    ["siteHeader", article.technicalPresence.hasSiteHeader],
    ["siteFooter", article.technicalPresence.hasSiteFooter]
  ]
    .filter(([, value]) => !value)
    .map(([field]) => field);

  article.risks = [];
  if (article.canonical && article.canonical !== expectedUrl) {
    article.risks.push(`Canonical diferente do esperado: ${article.canonical}`);
  }
  if (!article.schemas.hasBlogPosting) {
    article.risks.push("Sem BlogPosting; Astro precisaria gerar schema automaticamente.");
  }
  if (article.visibleFaqs.length === 0 && article.schemas.hasFAQPage) {
    article.risks.push("FAQPage existe, mas FAQ visivel nao foi extraido pelo seletor atual.");
  }
  if (article.visibleFaqs.length > 0 && !article.schemas.hasFAQPage) {
    article.risks.push("FAQ visivel sem FAQPage; Astro pode gerar FAQPage automaticamente.");
  }
  if (article.schemas.invalidJsonLd.length > 0) {
    article.risks.push("JSON-LD invalido encontrado.");
  }
  if (!article.articleContentHtml) {
    article.risks.push("Conteudo principal nao extraido.");
  }
  if (wordCount > 0 && wordCount < 900) {
    article.risks.push(`Conteudo curto para migracao editorial: ${wordCount} palavras.`);
  }
  if (article.internalLinks.length < 3) {
    article.risks.push(`Poucos links internos extraidos: ${article.internalLinks.length}.`);
  }

  return article;
}

function resolveArticleList() {
  if (mode === "pilot") {
    return pilotArticles;
  }

  return fs.readdirSync(articlesDir)
    .filter((file) => file.endsWith(".html"))
    .sort()
    .map((file) => toPosix(path.join("articles", file)));
}

function readArticlesJson() {
  if (!fs.existsSync(articlesJsonPath)) {
    return { exists: false, entries: [] };
  }

  const parsed = JSON.parse(fs.readFileSync(articlesJsonPath, "utf8"));
  const entries = Array.isArray(parsed) ? parsed : parsed.articles ?? [];
  return { exists: true, entries };
}

function readSitemap() {
  if (!fs.existsSync(sitemapPath)) {
    return { exists: false, urls: [], duplicates: [] };
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
    duplicates: [...counts.entries()].filter(([, count]) => count > 1).map(([url, count]) => ({ url, count }))
  };
}

function crossCheckArticlesJson(articles) {
  const data = readArticlesJson();
  const extractedByPath = new Map(articles.map((article) => [article.originalPath, article]));
  const extractedBySlug = new Map(articles.map((article) => [article.slug, article]));
  const entriesByPath = new Map();
  const entriesBySlug = new Map();

  for (const entry of data.entries) {
    const normalizedUrl = normalizePath(entry.url ?? "");
    if (normalizedUrl) entriesByPath.set(normalizedUrl, entry);
    const slug = path.basename(normalizedUrl, ".html");
    if (slug) entriesBySlug.set(slug, entry);
  }

  const articlesMissingInJson = articles
    .filter((article) => !entriesByPath.has(article.originalPath))
    .map((article) => article.originalPath);

  const jsonEntriesWithoutFile = data.entries
    .filter((entry) => {
      const normalizedUrl = normalizePath(entry.url ?? "");
      return normalizedUrl.startsWith("articles/") && !fs.existsSync(path.join(root, normalizedUrl));
    })
    .map((entry) => ({
      url: normalizePath(entry.url ?? ""),
      title: entry.title ?? null
    }));

  const titleDivergences = [];
  const categoryDivergences = [];
  const urlDivergences = [];

  for (const article of articles) {
    const entry = entriesByPath.get(article.originalPath);
    if (!entry) continue;

    const score = tokenSimilarity(article.title ?? article.h1 ?? "", entry.title ?? "");
    if (score < 0.45) {
      titleDivergences.push({
        path: article.originalPath,
        htmlTitle: article.title,
        jsonTitle: entry.title ?? null,
        similarity: Number(score.toFixed(2))
      });
    }

    if (article.category && entry.category && normalizeText(article.category) !== normalizeText(entry.category)) {
      categoryDivergences.push({
        path: article.originalPath,
        htmlCategory: article.category,
        jsonCategory: entry.category
      });
    }
  }

  for (const [slug, entry] of entriesBySlug.entries()) {
    const article = extractedBySlug.get(slug);
    if (!article) continue;
    const normalizedUrl = normalizePath(entry.url ?? "");
    if (normalizedUrl && normalizedUrl !== article.originalPath) {
      urlDivergences.push({
        slug,
        htmlPath: article.originalPath,
        jsonUrl: normalizedUrl
      });
    }
  }

  return {
    exists: data.exists,
    totalEntries: data.entries.length,
    articlesMissingInJson,
    jsonEntriesWithoutFile,
    titleDivergences,
    categoryDivergences,
    urlDivergences,
    extractedWithoutFileCheck: [...extractedByPath.keys()].length
  };
}

function crossCheckSitemap(articles) {
  const sitemap = readSitemap();
  const sitemapArticleUrls = sitemap.urls.filter((url) => normalizePath(url).startsWith("articles/"));
  const sitemapArticlePathSet = new Set(sitemapArticleUrls.map((url) => normalizePath(url)));
  const articlePathSet = new Set(articles.map((article) => article.originalPath));

  const articlesMissingInSitemap = articles
    .filter((article) => !sitemapArticlePathSet.has(article.originalPath))
    .map((article) => article.originalPath);

  const sitemapUrlsWithoutFile = sitemapArticleUrls
    .filter((url) => {
      const normalizedPath = normalizePath(url);
      return !articlePathSet.has(normalizedPath) || !fs.existsSync(path.join(root, normalizedPath));
    })
    .map((url) => ({
      url,
      path: normalizePath(url)
    }));

  const canonicalDivergences = articles
    .filter((article) => article.canonical && article.canonical !== article.expectedUrl)
    .map((article) => ({
      path: article.originalPath,
      canonical: article.canonical,
      expected: article.expectedUrl
    }));

  return {
    exists: sitemap.exists,
    totalUrls: sitemap.urls.length,
    totalArticleUrls: sitemapArticleUrls.length,
    duplicates: sitemap.duplicates,
    articlesMissingInSitemap,
    sitemapUrlsWithoutFile,
    canonicalDivergences
  };
}

function buildSummary(articles) {
  const articlesWithFaqVisibleWithoutFaqPage = articles.filter((article) => article.visibleFaqs.length > 0 && !article.schemas.hasFAQPage);
  const articlesWithoutMetaDescription = articles.filter((article) => !article.metaDescription);
  const articlesWithoutCanonical = articles.filter((article) => !article.canonical);
  const articlesWithoutH1 = articles.filter((article) => !article.h1);
  const articlesWithoutHeader = articles.filter((article) => !article.technicalPresence.hasSiteHeader);
  const articlesWithoutFooter = articles.filter((article) => !article.technicalPresence.hasSiteFooter);
  const articlesWithInvalidJsonLd = articles.filter((article) => article.schemas.invalidJsonLd.length > 0);
  const articlesWithFewInternalLinks = articles.filter((article) => article.internalLinks.length < 3);
  const articlesWithEmptyOrShortContent = articles.filter((article) => article.articleContentWordCount === 0 || article.articleContentWordCount < 900);
  const articlesWithMigrationRisk = articles.filter((article) => article.risks.length > 0);

  return {
    total: articles.length,
    withBlogPosting: articles.filter((article) => article.schemas.hasBlogPosting).length,
    withFAQPage: articles.filter((article) => article.schemas.hasFAQPage).length,
    withVisibleFaq: articles.filter((article) => article.visibleFaqs.length > 0).length,
    withGoogleAnalytics: articles.filter((article) => article.technicalPresence.hasGoogleAnalytics).length,
    withHeader: articles.filter((article) => article.technicalPresence.hasSiteHeader).length,
    withFooter: articles.filter((article) => article.technicalPresence.hasSiteFooter).length,
    invalidJsonLdCount: articles.reduce((total, article) => total + article.schemas.invalidJsonLd.length, 0),
    totalInternalLinks: articles.reduce((total, article) => total + article.internalLinks.length, 0),
    articlesWithFaqVisibleWithoutFaqPage: articlesWithFaqVisibleWithoutFaqPage.map((article) => article.originalPath),
    articlesWithoutMetaDescription: articlesWithoutMetaDescription.map((article) => article.originalPath),
    articlesWithoutCanonical: articlesWithoutCanonical.map((article) => article.originalPath),
    articlesWithoutH1: articlesWithoutH1.map((article) => article.originalPath),
    articlesWithoutHeader: articlesWithoutHeader.map((article) => article.originalPath),
    articlesWithoutFooter: articlesWithoutFooter.map((article) => article.originalPath),
    articlesWithInvalidJsonLd: articlesWithInvalidJsonLd.map((article) => ({
      path: article.originalPath,
      errors: article.schemas.invalidJsonLd
    })),
    articlesWithFewInternalLinks: articlesWithFewInternalLinks.map((article) => ({
      path: article.originalPath,
      count: article.internalLinks.length
    })),
    articlesWithEmptyOrShortContent: articlesWithEmptyOrShortContent.map((article) => ({
      path: article.originalPath,
      wordCount: article.articleContentWordCount
    })),
    articlesWithMigrationRisk: articlesWithMigrationRisk.map((article) => ({
      path: article.originalPath,
      risks: article.risks
    }))
  };
}

function addList(lines, items, emptyText, formatter = (item) => `- \`${item}\``) {
  if (!items || items.length === 0) {
    lines.push(`- ${emptyText}`);
    return;
  }

  for (const item of items) {
    lines.push(formatter(item));
  }
}

function makeReport(payload) {
  const lines = [];
  const isAll = payload.mode === "all";

  lines.push(isAll ? "# Relatorio da extracao completa de artigos legados" : "# Relatorio da extracao piloto de artigos legados");
  lines.push("");
  lines.push(`Modo: \`${payload.mode}\``);
  lines.push(`Gerado em: \`${payload.extractedAt}\``);
  lines.push(`Artigos processados: **${payload.articles.length}**`);
  lines.push("");
  lines.push("## Resumo tecnico");
  lines.push("");
  lines.push(`- Com Google Analytics: ${payload.summary.withGoogleAnalytics}/${payload.articles.length}`);
  lines.push(`- Com BlogPosting: ${payload.summary.withBlogPosting}/${payload.articles.length}`);
  lines.push(`- Com FAQPage: ${payload.summary.withFAQPage}/${payload.articles.length}`);
  lines.push(`- Com FAQ visivel extraida: ${payload.summary.withVisibleFaq}/${payload.articles.length}`);
  lines.push(`- Com header padrao: ${payload.summary.withHeader}/${payload.articles.length}`);
  lines.push(`- Com footer padrao: ${payload.summary.withFooter}/${payload.articles.length}`);
  lines.push(`- JSON-LD invalidos: ${payload.summary.invalidJsonLdCount}`);
  lines.push(`- Links internos extraidos: ${payload.summary.totalInternalLinks}`);
  lines.push("");

  if (isAll) {
    lines.push("## Problemas e pontos de atencao");
    lines.push("");
    lines.push(`- FAQ visivel sem FAQPage: ${payload.summary.articlesWithFaqVisibleWithoutFaqPage.length}`);
    lines.push(`- Sem meta description: ${payload.summary.articlesWithoutMetaDescription.length}`);
    lines.push(`- Sem canonical: ${payload.summary.articlesWithoutCanonical.length}`);
    lines.push(`- Sem H1: ${payload.summary.articlesWithoutH1.length}`);
    lines.push(`- Sem header: ${payload.summary.articlesWithoutHeader.length}`);
    lines.push(`- Sem footer: ${payload.summary.articlesWithoutFooter.length}`);
    lines.push(`- JSON-LD invalido: ${payload.summary.articlesWithInvalidJsonLd.length}`);
    lines.push(`- Poucos links internos (<3): ${payload.summary.articlesWithFewInternalLinks.length}`);
    lines.push(`- Conteudo vazio ou curto (<900 palavras extraidas): ${payload.summary.articlesWithEmptyOrShortContent.length}`);
    lines.push(`- Possivel risco de migracao: ${payload.summary.articlesWithMigrationRisk.length}`);
    lines.push("");

    lines.push("### Artigos com FAQ visivel mas sem FAQPage");
    addList(lines, payload.summary.articlesWithFaqVisibleWithoutFaqPage, "Nenhum.");
    lines.push("");

    lines.push("### Artigos sem meta description");
    addList(lines, payload.summary.articlesWithoutMetaDescription, "Nenhum.");
    lines.push("");

    lines.push("### Artigos sem canonical");
    addList(lines, payload.summary.articlesWithoutCanonical, "Nenhum.");
    lines.push("");

    lines.push("### Artigos sem H1");
    addList(lines, payload.summary.articlesWithoutH1, "Nenhum.");
    lines.push("");

    lines.push("### Artigos sem header");
    addList(lines, payload.summary.articlesWithoutHeader, "Nenhum.");
    lines.push("");

    lines.push("### Artigos sem footer");
    addList(lines, payload.summary.articlesWithoutFooter, "Nenhum.");
    lines.push("");

    lines.push("### Artigos com JSON-LD invalido");
    addList(
      lines,
      payload.summary.articlesWithInvalidJsonLd,
      "Nenhum.",
      (item) => `- \`${item.path}\`: ${item.errors.join("; ")}`
    );
    lines.push("");

    lines.push("### Artigos com poucos links internos");
    addList(
      lines,
      payload.summary.articlesWithFewInternalLinks,
      "Nenhum.",
      (item) => `- \`${item.path}\`: ${item.count} links internos`
    );
    lines.push("");

    lines.push("### Artigos com conteudo vazio ou curto");
    addList(
      lines,
      payload.summary.articlesWithEmptyOrShortContent,
      "Nenhum.",
      (item) => `- \`${item.path}\`: ${item.wordCount} palavras extraidas`
    );
    lines.push("");

    lines.push("## Verificacao cruzada com articles.json");
    lines.push("");
    lines.push(`- Arquivo encontrado: ${payload.crossChecks.articlesJson.exists ? "sim" : "nao"}`);
    lines.push(`- Entradas em articles.json: ${payload.crossChecks.articlesJson.totalEntries}`);
    lines.push(`- Artigos em /articles ausentes no articles.json: ${payload.crossChecks.articlesJson.articlesMissingInJson.length}`);
    lines.push(`- Entradas no articles.json sem arquivo correspondente: ${payload.crossChecks.articlesJson.jsonEntriesWithoutFile.length}`);
    lines.push(`- Divergencias grandes de titulo: ${payload.crossChecks.articlesJson.titleDivergences.length}`);
    lines.push(`- Divergencias de categoria: ${payload.crossChecks.articlesJson.categoryDivergences.length}`);
    lines.push(`- Divergencias de URL: ${payload.crossChecks.articlesJson.urlDivergences.length}`);
    lines.push("");

    lines.push("### Artigos ausentes no articles.json");
    addList(lines, payload.crossChecks.articlesJson.articlesMissingInJson, "Nenhum.");
    lines.push("");

    lines.push("### Entradas no articles.json sem arquivo");
    addList(
      lines,
      payload.crossChecks.articlesJson.jsonEntriesWithoutFile,
      "Nenhuma.",
      (item) => `- \`${item.url}\`: ${item.title ?? "(sem titulo)"}`
    );
    lines.push("");

    lines.push("### Divergencias grandes de titulo");
    addList(
      lines,
      payload.crossChecks.articlesJson.titleDivergences,
      "Nenhuma.",
      (item) => `- \`${item.path}\` (${item.similarity}): HTML="${item.htmlTitle}" | JSON="${item.jsonTitle}"`
    );
    lines.push("");

    lines.push("### Divergencias de categoria");
    addList(
      lines,
      payload.crossChecks.articlesJson.categoryDivergences,
      "Nenhuma.",
      (item) => `- \`${item.path}\`: HTML="${item.htmlCategory}" | JSON="${item.jsonCategory}"`
    );
    lines.push("");

    lines.push("### Divergencias de URL");
    addList(
      lines,
      payload.crossChecks.articlesJson.urlDivergences,
      "Nenhuma.",
      (item) => `- \`${item.slug}\`: HTML="${item.htmlPath}" | JSON="${item.jsonUrl}"`
    );
    lines.push("");

    lines.push("## Verificacao cruzada com sitemap.xml");
    lines.push("");
    lines.push(`- Arquivo encontrado: ${payload.crossChecks.sitemap.exists ? "sim" : "nao"}`);
    lines.push(`- URLs totais no sitemap: ${payload.crossChecks.sitemap.totalUrls}`);
    lines.push(`- URLs de artigos no sitemap: ${payload.crossChecks.sitemap.totalArticleUrls}`);
    lines.push(`- Artigos em /articles ausentes no sitemap: ${payload.crossChecks.sitemap.articlesMissingInSitemap.length}`);
    lines.push(`- URLs de artigos no sitemap sem arquivo correspondente: ${payload.crossChecks.sitemap.sitemapUrlsWithoutFile.length}`);
    lines.push(`- Divergencias de canonical: ${payload.crossChecks.sitemap.canonicalDivergences.length}`);
    lines.push(`- URLs duplicadas no sitemap: ${payload.crossChecks.sitemap.duplicates.length}`);
    lines.push("");

    lines.push("### Artigos ausentes no sitemap");
    addList(lines, payload.crossChecks.sitemap.articlesMissingInSitemap, "Nenhum.");
    lines.push("");

    lines.push("### URLs de artigos no sitemap sem arquivo");
    addList(
      lines,
      payload.crossChecks.sitemap.sitemapUrlsWithoutFile,
      "Nenhuma.",
      (item) => `- \`${item.url}\``
    );
    lines.push("");

    lines.push("### Divergencias de canonical");
    addList(
      lines,
      payload.crossChecks.sitemap.canonicalDivergences,
      "Nenhuma.",
      (item) => `- \`${item.path}\`: canonical="${item.canonical}" | esperado="${item.expected}"`
    );
    lines.push("");

    lines.push("### Duplicatas no sitemap");
    addList(
      lines,
      payload.crossChecks.sitemap.duplicates,
      "Nenhuma.",
      (item) => `- \`${item.url}\`: ${item.count} vezes`
    );
    lines.push("");
  }

  lines.push("## Artigos processados");
  lines.push("");
  lines.push("| Artigo | Campos ausentes | Palavras | Links internos | GA | Header | Footer | BlogPosting | FAQPage | FAQ visivel | Riscos |");
  lines.push("| --- | ---: | ---: | ---: | --- | --- | --- | --- | --- | ---: | ---: |");

  for (const article of payload.articles) {
    lines.push([
      `| \`${article.originalPath}\``,
      article.missingFields.length,
      article.articleContentWordCount,
      article.internalLinks.length,
      article.technicalPresence.hasGoogleAnalytics ? "sim" : "nao",
      article.technicalPresence.hasSiteHeader ? "sim" : "nao",
      article.technicalPresence.hasSiteFooter ? "sim" : "nao",
      article.schemas.hasBlogPosting ? "sim" : "nao",
      article.schemas.hasFAQPage ? "sim" : "nao",
      article.visibleFaqs.length,
      `${article.risks.length} |`
    ].join(" | "));
  }

  lines.push("");
  lines.push("## Recomendacao para proxima fase");
  lines.push("");

  if (isAll) {
    lines.push("A extracao completa indica que o acervo pode virar base da migracao Astro se a proxima fase preservar o HTML do corpo, gerar schema automaticamente quando houver FAQ visivel sem FAQPage, e tratar os poucos riscos listados antes de substituir paginas finais.");
    lines.push("A proxima tarefa recomendada e criar uma rota Astro experimental consumindo `legacy-articles.json` para um subconjunto de 10 a 20 artigos, sem remover os HTML legados, e comparar HTML gerado, canonical, schema, links internos e renderizacao visual.");
  } else {
    lines.push("A extracao piloto deve ser considerada segura para ampliar quando os 10 artigos preservarem title, canonical, BlogPosting, conteudo principal, links internos, GA, header e footer sem perdas criticas.");
    lines.push("A proxima etapa recomendada e transformar este JSON em uma fonte Astro hibrida de teste para os mesmos 10 artigos, mantendo o HTML legado do corpo dentro do layout Astro e comparando o HTML gerado com as URLs atuais.");
  }

  return `${lines.join("\n").replace(/\n+$/, "")}\n`;
}

function main() {
  const articleList = resolveArticleList();
  const missingFiles = articleList.filter((relativePath) => !fs.existsSync(path.join(root, relativePath)));

  if (missingFiles.length > 0) {
    console.error("Arquivos esperados ausentes:");
    for (const file of missingFiles) {
      console.error(`- ${file}`);
    }
    process.exit(1);
  }

  const articles = articleList.map(extractArticle);
  const payload = {
    mode,
    extractedAt: new Date().toISOString(),
    source: "legacy-html",
    articles,
    summary: buildSummary(articles),
    crossChecks: {
      articlesJson: crossCheckArticlesJson(articles),
      sitemap: crossCheckSitemap(articles)
    }
  };

  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(path.join(outputDir, outputJson), `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  fs.writeFileSync(path.join(outputDir, outputReport), makeReport(payload), "utf8");

  console.log(`Extracao ${mode} concluida: ${articles.length} artigos.`);
  console.log(`JSON: ${toPosix(path.relative(root, path.join(outputDir, outputJson)))}`);
  console.log(`Relatorio: ${toPosix(path.relative(root, path.join(outputDir, outputReport)))}`);
}

main();
