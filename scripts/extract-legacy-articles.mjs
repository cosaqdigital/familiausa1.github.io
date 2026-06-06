import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const articlesDir = path.join(root, "articles");
const outputDir = path.join(root, "src", "data", "legacy-extract");
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

const mode = process.argv.includes("--pilot") ? "pilot" : "full";
const outputJson = mode === "pilot" ? "pilot-articles.json" : "all-articles.json";
const outputReport = mode === "pilot" ? "pilot-report.md" : "all-report.md";

function toPosix(filePath) {
  return filePath.replaceAll("\\", "/");
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

function findMeta(html, key, value) {
  for (const match of html.matchAll(/<meta\b[^>]*>/gi)) {
    const attrs = parseAttrs(match[0]);
    if ((attrs.name === key || attrs.property === key) && attrs.content !== undefined) {
      if (value === undefined || attrs.name === value || attrs.property === value) {
        return attrs.content.trim();
      }
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

    const anchor = stripTags(html.slice(match.index ?? 0, html.indexOf("</a>", match.index ?? 0) + 4));
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

function makeReport(payload) {
  const lines = [];
  lines.push("# Relatorio da extracao piloto de artigos legados");
  lines.push("");
  lines.push(`Modo: \`${payload.mode}\``);
  lines.push(`Gerado em: \`${payload.extractedAt}\``);
  lines.push(`Artigos processados: **${payload.articles.length}**`);
  lines.push("");
  lines.push("## Resumo");
  lines.push("");
  lines.push(`- Com BlogPosting: ${payload.summary.withBlogPosting}/${payload.articles.length}`);
  lines.push(`- Com FAQPage: ${payload.summary.withFAQPage}/${payload.articles.length}`);
  lines.push(`- Com FAQ visivel extraida: ${payload.summary.withVisibleFaq}/${payload.articles.length}`);
  lines.push(`- Com Google Analytics: ${payload.summary.withGoogleAnalytics}/${payload.articles.length}`);
  lines.push(`- Com header padrao: ${payload.summary.withHeader}/${payload.articles.length}`);
  lines.push(`- Com footer padrao: ${payload.summary.withFooter}/${payload.articles.length}`);
  lines.push(`- JSON-LD invalidos: ${payload.summary.invalidJsonLdCount}`);
  lines.push("");
  lines.push("## Artigos processados");
  lines.push("");
  lines.push("| Artigo | Campos ausentes | Links internos | GA | Header | Footer | BlogPosting | FAQPage | FAQ visivel | Riscos |");
  lines.push("| --- | ---: | ---: | --- | --- | --- | --- | --- | --- | ---: |");

  for (const article of payload.articles) {
    lines.push([
      `| \`${article.originalPath}\``,
      article.missingFields.length,
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
  lines.push("## Detalhe por artigo");

  for (const article of payload.articles) {
    lines.push("");
    lines.push(`### ${article.originalPath}`);
    lines.push("");
    lines.push(`- Title: ${article.title ?? "(ausente)"}`);
    lines.push(`- H1: ${article.h1 ?? "(ausente)"}`);
    lines.push(`- Categoria: ${article.category ?? "(ausente)"}`);
    lines.push(`- Canonical: ${article.canonical ?? "(ausente)"}`);
    lines.push(`- Data publicada: ${article.datePublished ?? "(ausente)"}`);
    lines.push(`- Data modificada: ${article.dateModified ?? "(ausente)"}`);
    lines.push(`- Tempo de leitura: ${article.readingTime ?? "(ausente)"}`);
    lines.push(`- Palavras no conteudo extraido: ${article.articleContentWordCount}`);
    lines.push(`- Links internos extraidos: ${article.internalLinks.length}`);
    lines.push(`- Perguntas visiveis extraidas: ${article.visibleFaqs.length}`);

    if (article.missingFields.length > 0) {
      lines.push(`- Campos ausentes: ${article.missingFields.join(", ")}`);
    } else {
      lines.push("- Campos ausentes: nenhum campo critico no extractor piloto");
    }

    if (article.risks.length > 0) {
      lines.push("- Riscos detectados:");
      for (const risk of article.risks) {
        lines.push(`  - ${risk}`);
      }
    } else {
      lines.push("- Riscos detectados: nenhum risco critico no extractor piloto");
    }
  }

  lines.push("");
  lines.push("## Recomendacao para proxima fase");
  lines.push("");
  lines.push("A extracao piloto deve ser considerada segura para ampliar quando os 10 artigos preservarem title, canonical, BlogPosting, conteudo principal, links internos, GA, header e footer sem perdas criticas.");
  lines.push("A proxima etapa recomendada e transformar este JSON em uma fonte Astro hibrida de teste para os mesmos 10 artigos, mantendo o HTML legado do corpo dentro do layout Astro e comparando o HTML gerado com as URLs atuais.");
  lines.push("");

  return `${lines.join("\n")}\n`;
}

function main() {
  const articleList = resolveArticleList();
  const missingFiles = articleList.filter((relativePath) => !fs.existsSync(path.join(root, relativePath)));

  if (missingFiles.length > 0) {
    console.error("Arquivos piloto ausentes:");
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
    summary: {
      total: articles.length,
      withBlogPosting: articles.filter((article) => article.schemas.hasBlogPosting).length,
      withFAQPage: articles.filter((article) => article.schemas.hasFAQPage).length,
      withVisibleFaq: articles.filter((article) => article.visibleFaqs.length > 0).length,
      withGoogleAnalytics: articles.filter((article) => article.technicalPresence.hasGoogleAnalytics).length,
      withHeader: articles.filter((article) => article.technicalPresence.hasSiteHeader).length,
      withFooter: articles.filter((article) => article.technicalPresence.hasSiteFooter).length,
      invalidJsonLdCount: articles.reduce((total, article) => total + article.schemas.invalidJsonLd.length, 0),
      totalInternalLinks: articles.reduce((total, article) => total + article.internalLinks.length, 0)
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
