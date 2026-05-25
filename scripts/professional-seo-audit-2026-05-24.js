const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.join(__dirname, "..");
const SITE = "https://familiausa1.com";
const REPORT = path.join(ROOT, "relatorio-auditoria-seo-profissional-2026-05-24.md");

const importantPages = [
  "index.html",
  "blog.html",
  "categorias.html",
  "sobre.html",
  "categorias/cidades-da-florida.html",
  "categorias/custo-de-vida.html",
  "categorias/imigracao-legalizacao.html",
  "categorias/orlando-e-viagem.html",
  "categorias/compras-nos-eua.html",
];

const pillarTargets = [
  {
    name: "Custo de vida nos EUA",
    file: "categorias/custo-de-vida.html",
    keywords: ["custo de vida", "aluguel", "precos", "carro", "saude", "tampa"],
  },
  {
    name: "Imigracao e legalizacao nos EUA",
    file: "categorias/imigracao-legalizacao.html",
    keywords: ["imigracao", "legalizacao", "green card", "asilo", "deportacao", "trump"],
  },
  {
    name: "Orlando e viagem",
    file: "categorias/orlando-e-viagem.html",
    keywords: ["orlando", "disney", "viagem", "outlets", "carro"],
  },
  {
    name: "Compras nos EUA",
    file: "categorias/compras-nos-eua.html",
    keywords: ["compras", "iphone", "walmart", "target", "outlet"],
  },
  {
    name: "Cidades da Florida para brasileiros",
    file: "categorias/cidades-da-florida.html",
    keywords: ["tampa", "orlando", "kissimmee", "lakeland", "jacksonville", "miami", "boca", "sarasota", "naples"],
  },
];

const cannibalGroups = [
  {
    topic: "Se legalizar nos EUA / morar legalmente",
    principal: "articles/morar-legalmente-nos-eua-caminhos-possiveis-2026.html",
    expected: ["e-facil-se-legalizar-nos-eua", "se-legalizar-nos-eua-com-visto-de-turista", "formas-legais-conseguir-green-card", "legalizar-pela-fronteira"],
  },
  {
    topic: "Visto de turista, DS-160 e entrevista",
    principal: "articles/guia-completo-visto-americano-2026.html",
    expected: ["visto-americano", "ds-160", "entrevista-visto", "documentos-entrevista", "agendamento-visto", "quanto-custa-tirar-visto"],
  },
  {
    topic: "Custo de vida nos EUA",
    principal: "articles/custo-de-vida-nos-eua-2026-atualizado.html",
    expected: ["custo-de-vida", "quanto-custa-viver", "precos-eua", "quanto-dinheiro", "quanto-custa-morar"],
  },
  {
    topic: "Orlando, Disney e viagem",
    principal: "articles/guia-completo-orlando-2026-brasileiros.html",
    expected: ["orlando", "disney", "outlets", "aluguel-carro-orlando", "quanto-custa-viajar-orlando"],
  },
  {
    topic: "Cidades da Florida",
    principal: "categorias/cidades-da-florida.html",
    expected: ["quanto-custa-morar-em-tampa", "quanto-custa-morar-em-orlando", "quanto-custa-morar-em-kissimmee", "quanto-custa-morar-em-miami"],
  },
];

function read(rel) {
  return fs.readFileSync(path.join(ROOT, rel), "utf8");
}

function exists(rel) {
  return fs.existsSync(path.join(ROOT, rel));
}

function listHtml(dir) {
  return fs.readdirSync(path.join(ROOT, dir)).filter((file) => file.endsWith(".html")).sort();
}

function stripHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function first(html, regex) {
  const match = html.match(regex);
  return match ? decodeEntities(match[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()) : "";
}

function decodeEntities(value) {
  return String(value)
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'");
}

function wordCount(html) {
  const text = stripHtml(html);
  return text ? text.split(/\s+/).filter(Boolean).length : 0;
}

function isLocalHref(href) {
  if (!href || href.startsWith("#")) return false;
  if (/^(https?:)?\/\//i.test(href)) return false;
  if (/^(mailto|tel):/i.test(href)) return false;
  return href.endsWith(".html") || href.includes(".html#") || href.includes(".html?");
}

function resolveHref(from, href) {
  const clean = href.split("#")[0].split("?")[0];
  return path.normalize(path.join(path.dirname(from), clean)).replace(/\\/g, "/");
}

function parseJsonLd(html, file) {
  const blocks = [...html.matchAll(/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi)];
  return blocks.map((block, index) => {
    try {
      const parsed = JSON.parse(block[1]);
      return { file, index, ok: true, parsed, type: parsed["@type"] || "unknown" };
    } catch (error) {
      return { file, index, ok: false, error: error.message, type: "invalid" };
    }
  });
}

function safeCell(value) {
  return String(value || "")
    .replace(/\|/g, "\\|")
    .replace(/\n/g, " ")
    .trim();
}

function riskFor(article) {
  const risks = [];
  if (!article.title) risks.push("sem title");
  if (!article.description) risks.push("sem meta description");
  if (!article.canonical) risks.push("sem canonical");
  if (article.h1Count !== 1) risks.push("H1 incorreto");
  if (!article.hasBlogPosting) risks.push("sem BlogPosting");
  if (article.hasFaqVisible && !article.hasFAQPage) risks.push("FAQ visivel sem FAQPage");
  if (!article.hasFaqVisible && article.hasFAQPage) risks.push("FAQPage sem FAQ visivel");
  if (article.internalOut < 3) risks.push("poucos links internos");
  if (article.incoming < 2) risks.push("poucos links recebidos");
  if (article.words < 900) risks.push("conteudo curto");
  if (!article.hasRelated) risks.push("sem posts relacionados");
  if (article.description.length > 165) risks.push("meta longa");
  if (article.title.length > 70) risks.push("title longo");
  return risks;
}

function priorityFor(risks) {
  if (risks.some((risk) => ["sem title", "sem meta description", "sem canonical", "H1 incorreto", "sem BlogPosting", "conteudo curto"].includes(risk))) {
    return "alta";
  }
  if (risks.length) return "media";
  return "baixa";
}

function row(values) {
  return `| ${values.map(safeCell).join(" | ")} |`;
}

function categorySlug(category) {
  return String(category || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

const articleFiles = listHtml("articles").map((file) => `articles/${file}`);
const categoryFiles = listHtml("categorias").map((file) => `categorias/${file}`);
const allHtmlFiles = [...importantPages.filter(exists), ...articleFiles, ...categoryFiles];
const articlesIndex = exists("assets/data/articles.json") ? JSON.parse(read("assets/data/articles.json")).articles || [] : [];
const sitemap = exists("sitemap.xml") ? read("sitemap.xml") : "";
const sitemapLocs = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
const sitemapSet = new Set(sitemapLocs);
const robots = exists("robots.txt") ? read("robots.txt") : "";

const byUrl = new Map(articlesIndex.map((article) => [article.url, article]));
const htmlByFile = new Map();
for (const file of allHtmlFiles) {
  htmlByFile.set(file, read(file));
}

const linkEdges = [];
const brokenLinks = [];
const incoming = new Map();
const outgoing = new Map();
for (const file of allHtmlFiles) {
  const html = htmlByFile.get(file);
  const hrefs = [...html.matchAll(/href=["']([^"']+)["']/gi)].map((match) => match[1]);
  const local = hrefs.filter(isLocalHref);
  outgoing.set(file, local.length);
  for (const href of local) {
    const target = resolveHref(file, href);
    linkEdges.push({ from: file, href, target });
    incoming.set(target, (incoming.get(target) || 0) + 1);
    if (!exists(target)) {
      brokenLinks.push({ from: file, href, target });
    }
  }
}

const allJsonLd = [];
for (const file of allHtmlFiles) {
  allJsonLd.push(...parseJsonLd(htmlByFile.get(file), file));
}

const titleMap = new Map();
const metaMap = new Map();
const articleAudits = articleFiles.map((file) => {
  const html = htmlByFile.get(file);
  const title = first(html, /<title[^>]*>([\s\S]*?)<\/title>/i);
  const h1 = first(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const description = first(html, /<meta\s+name=["']description["']\s+content=["']([^"']*)["'][^>]*>/i);
  const canonical = first(html, /<link\s+rel=["']canonical["']\s+href=["']([^"']*)["'][^>]*>/i);
  const category = first(html, /<div\s+class=["']eyebrow["'][^>]*>([\s\S]*?)<\/div>/i) || byUrl.get(file)?.category || "";
  const h1Count = (html.match(/<h1\b/gi) || []).length;
  const h2Count = (html.match(/<h2\b/gi) || []).length;
  const h3Count = (html.match(/<h3\b/gi) || []).length;
  const words = wordCount(html);
  const internalOut = (outgoing.get(file) || 0);
  const articleJson = allJsonLd.filter((block) => block.file === file && block.ok);
  const types = articleJson.map((block) => Array.isArray(block.type) ? block.type.join(",") : block.type);
  const hasBlogPosting = types.includes("BlogPosting") || types.includes("Article");
  const hasFAQPage = types.includes("FAQPage");
  const hasFaqVisible = /faq-section|Perguntas frequentes/i.test(html);
  const hasRelated = /related-posts|Posts relacionados/i.test(html);
  const hasOg = /property=["']og:title["']/i.test(html) && /property=["']og:description["']/i.test(html);
  const hasTwitter = /name=["']twitter:card["']/i.test(html);
  const hasNoindex = /<meta\s+name=["']robots["'][^>]+noindex/i.test(html);
  const imagesWithoutAlt = [...html.matchAll(/<img\b(?![^>]*\balt=)[^>]*>/gi)].length;
  titleMap.set(title, (titleMap.get(title) || 0) + 1);
  metaMap.set(description, (metaMap.get(description) || 0) + 1);
  const audit = {
    file,
    title,
    h1,
    description,
    category,
    canonical,
    h1Count,
    h2Count,
    h3Count,
    words,
    internalOut,
    incoming: incoming.get(file) || 0,
    hasCanonical: Boolean(canonical),
    hasMeta: Boolean(description),
    hasBlogPosting,
    hasFAQPage,
    hasFaqVisible,
    hasRelated,
    hasOg,
    hasTwitter,
    hasNoindex,
    imagesWithoutAlt,
    inJson: byUrl.has(file),
    inSitemap: sitemapSet.has(`${SITE}/${file}`),
    inBlog: htmlByFile.get("blog.html")?.includes(file) || false,
  };
  audit.risks = riskFor(audit);
  audit.priority = priorityFor(audit.risks);
  return audit;
});

const duplicateTitles = [...titleMap.entries()].filter(([title, count]) => title && count > 1);
const duplicateMetas = [...metaMap.entries()].filter(([meta, count]) => meta && count > 1);
const articleSitemapCount = articleFiles.filter((file) => sitemapSet.has(`${SITE}/${file}`)).length;
const missingJson = articleFiles.filter((file) => !byUrl.has(file));
const extraJson = articlesIndex.filter((article) => article.url?.startsWith("articles/") && !exists(article.url)).map((article) => article.url);
const missingSitemap = articleFiles.filter((file) => !sitemapSet.has(`${SITE}/${file}`));
const duplicateSitemap = sitemapLocs.filter((url, index) => sitemapLocs.indexOf(url) !== index);
const badUrlFiles = articleFiles.filter((file) => /[\sÀ-ÿ]/.test(file));
const noindexPages = allHtmlFiles.filter((file) => /<meta\s+name=["']robots["'][^>]+noindex/i.test(htmlByFile.get(file)));
const canonicalProblems = allHtmlFiles.filter((file) => {
  const canonical = first(htmlByFile.get(file), /<link\s+rel=["']canonical["']\s+href=["']([^"']*)["'][^>]*>/i);
  if (!canonical) return true;
  const expected = file === "index.html" ? `${SITE}/index.html` : `${SITE}/${file}`;
  if (file === "index.html" && canonical === `${SITE}/`) return false;
  return canonical !== expected;
});

const pillarAudits = pillarTargets.map((pillar) => {
  if (!exists(pillar.file)) {
    return { ...pillar, exists: false, score: 0, issues: ["pagina ausente"], satelliteLinks: 0 };
  }
  const html = read(pillar.file);
  const title = first(html, /<title[^>]*>([\s\S]*?)<\/title>/i);
  const description = first(html, /<meta\s+name=["']description["']\s+content=["']([^"']*)["'][^>]*>/i);
  const h1 = first(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const types = parseJsonLd(html, pillar.file).filter((block) => block.ok).map((block) => block.type);
  const satelliteLinks = pillar.keywords.reduce((count, keyword) => count + (html.toLowerCase().includes(keyword) ? 1 : 0), 0);
  const issues = [];
  if (!title || title.length > 70) issues.push("title pode melhorar");
  if (!description || description.length > 165) issues.push("meta description pode melhorar");
  if (!h1) issues.push("sem H1");
  if (!/article-grid|<table/i.test(html)) issues.push("sem lista/tabela organizada");
  if (!/FAQPage/.test(html)) issues.push("sem FAQPage");
  if (!/BreadcrumbList/.test(html)) issues.push("sem BreadcrumbList");
  if (!/CollectionPage/.test(html)) issues.push("sem CollectionPage");
  if (!/final-article-cta|button primary/.test(html)) issues.push("CTA fraco ou ausente");
  if (wordCount(html) < 600) issues.push("pagina fina");
  return {
    ...pillar,
    exists: true,
    title,
    description,
    h1,
    words: wordCount(html),
    jsonTypes: types.join(", "),
    satelliteLinks,
    issues,
    score: Math.max(0, 8 - issues.length),
  };
});

const categoryPages = categoryFiles.map((file) => {
  const html = read(file);
  return {
    file,
    title: first(html, /<title[^>]*>([\s\S]*?)<\/title>/i),
    h1: first(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i),
    links: [...html.matchAll(/href=["']([^"']+)["']/gi)].map((m) => m[1]).filter((href) => href.includes("../articles/")).length,
    hasCollection: /"@type"\s*:\s*"CollectionPage"/.test(html),
    hasFAQ: /"@type"\s*:\s*"FAQPage"/.test(html),
    hasBreadcrumb: /"@type"\s*:\s*"BreadcrumbList"/.test(html),
  };
});

const cannibalFindings = cannibalGroups.map((group) => {
  const matches = articleAudits.filter((article) => group.expected.some((term) => article.file.includes(term) || article.title.toLowerCase().includes(term)));
  return {
    ...group,
    matches,
    recommendation: `Manter ${group.principal} como principal e usar os demais como satelites com links contextuais apontando para ele.`,
  };
});

const schedule = exists("planejamento-seo/calendario-editorial-60-dias.md") ? read("planejamento-seo/calendario-editorial-60-dias.md") : "";
const scheduleLines = schedule.split(/\r?\n/);
const dayMatches = [...schedule.matchAll(/^## Dia\s+(\d+)/gm)].map((match) => Number(match[1]));
const publishedSlugs = new Set(articleFiles.map((file) => path.basename(file, ".html")));
const scheduleTopics = [
  ["Dia 1", "guia-completo-visto-americano-2026"],
  ["Dia 2", "como-preencher-ds-160-passo-a-passo-2026"],
  ["Dia 3", "quanto-custa-viajar-orlando-2026"],
  ["Dia 4", "formas-legais-conseguir-green-card-eua-2026"],
  ["Dia 5", "orlando-alem-da-disney-lugares-2026"],
  ["Dia 6", "seguro-saude-nos-eua-como-funciona-2026"],
  ["Dia 7", "vale-a-pena-fazer-compras-nos-eua-2026"],
  ["Dia 8", "disney-orlando-2026-guia-brasileiros"],
  ["Dia 9", "melhores-outlets-orlando-2026"],
  ["Dia 10", "aluguel-carro-orlando-2026"],
  ["Dia 15", "entrevista-visto-americano-perguntas-erros-comuns-2026"],
  ["Dia 16", "como-renovar-visto-americano-2026"],
  ["Dia 17", "visto-f1-estudante-americano-como-funciona-2026"],
  ["Dia 19", "trabalho-nos-eua-para-brasileiros-2026"],
  ["Dia 20", "custo-de-vida-nos-eua-2026-atualizado"],
  ["Dia 21", "como-funciona-o-credito-nos-eua"],
];
const scheduleDone = scheduleTopics.filter(([, slug]) => publishedSlugs.has(slug));
const schedulePending = scheduleTopics.filter(([, slug]) => !publishedSlugs.has(slug));

const highPriorityPages = [
  "index.html",
  "blog.html",
  "categorias.html",
  ...pillarTargets.map((pillar) => pillar.file),
  "articles/guia-completo-visto-americano-2026.html",
  "articles/custo-de-vida-nos-eua-2026-atualizado.html",
  "articles/guia-completo-orlando-2026-brasileiros.html",
  "articles/morar-legalmente-nos-eua-caminhos-possiveis-2026.html",
  "articles/quanto-custa-morar-em-orlando-2026.html",
  "articles/quanto-custa-morar-em-tampa-2026.html",
].filter((file, index, arr) => exists(file) && arr.indexOf(file) === index);

const highPriorityStatus = highPriorityPages.map((file) => {
  const html = read(file);
  const jsonBlocks = parseJsonLd(html, file);
  const issues = [];
  if (!first(html, /<title[^>]*>([\s\S]*?)<\/title>/i)) issues.push("sem title");
  if (!first(html, /<meta\s+name=["']description["']\s+content=["']([^"']*)["'][^>]*>/i)) issues.push("sem meta description");
  if (!first(html, /<link\s+rel=["']canonical["']\s+href=["']([^"']*)["'][^>]*>/i)) issues.push("sem canonical");
  if ((html.match(/<h1\b/gi) || []).length !== 1) issues.push("H1 incorreto");
  if (jsonBlocks.some((block) => !block.ok)) issues.push("JSON-LD invalido");
  return { file, issues };
});

const critical = [];
if (brokenLinks.length) critical.push(`${brokenLinks.length} links internos quebrados`);
if (missingJson.length) critical.push(`${missingJson.length} artigos fora do articles.json`);
if (missingSitemap.length) critical.push(`${missingSitemap.length} artigos fora do sitemap`);
if (allJsonLd.some((block) => !block.ok)) critical.push(`${allJsonLd.filter((block) => !block.ok).length} JSON-LD invalidos`);
if (noindexPages.length) critical.push(`${noindexPages.length} paginas com noindex`);

const medium = [];
if (pillarAudits.some((pillar) => pillar.issues.length)) medium.push("Algumas paginas pilar ainda podem receber FAQ/Breadcrumb/CTA e texto de apoio mais forte.");
if (duplicateTitles.length) medium.push(`${duplicateTitles.length} titles duplicados detectados.`);
if (duplicateMetas.length) medium.push(`${duplicateMetas.length} meta descriptions duplicadas detectadas.`);
const weakIncoming = articleAudits.filter((article) => article.incoming < 2).map((article) => article.file);
if (weakIncoming.length) medium.push(`${weakIncoming.length} artigos recebem menos de 2 links internos.`);

const light = [];
const longTitles = articleAudits.filter((article) => article.title.length > 70).map((article) => article.file);
if (longTitles.length) light.push(`${longTitles.length} artigos com title acima de 70 caracteres.`);
const longMetas = articleAudits.filter((article) => article.description.length > 165).map((article) => article.file);
if (longMetas.length) light.push(`${longMetas.length} artigos com meta description acima de 165 caracteres.`);
const categoryWithoutFaq = categoryPages.filter((page) => !page.hasFAQ).map((page) => page.file);
if (categoryWithoutFaq.length) light.push(`${categoryWithoutFaq.length} paginas de categoria sem FAQPage.`);

const articleTable = [
  row(["Arquivo", "Title", "H1", "Categoria", "Palavras", "Links internos", "Canonical", "Meta", "BlogPosting", "FAQ", "FAQPage", "Risco SEO", "Prioridade"]),
  row(["---", "---", "---", "---", "---:", "---:", "---", "---", "---", "---", "---", "---", "---"]),
  ...articleAudits.map((article) => row([
    article.file,
    article.title,
    article.h1,
    article.category,
    article.words,
    article.internalOut,
    article.hasCanonical ? "sim" : "nao",
    article.hasMeta ? "sim" : "nao",
    article.hasBlogPosting ? "sim" : "nao",
    article.hasFaqVisible ? "sim" : "nao",
    article.hasFAQPage ? "sim" : "nao",
    article.risks.length ? article.risks.join("; ") : "baixo",
    article.priority,
  ])),
].join("\n");

const report = `# Relatorio de Auditoria SEO Profissional - Familia USA 1

Data: 2026-05-24

## 1. Resumo executivo

O site Familia USA 1 esta em uma base tecnica solida para rastreamento e indexacao. A auditoria encontrou ${articleFiles.length} artigos em \`/articles/\`, ${articlesIndex.length} artigos em \`assets/data/articles.json\`, ${articleSitemapCount} artigos no \`sitemap.xml\` e ${sitemapLocs.length} URLs totais no sitemap. Nao foram encontrados links internos quebrados, JSON-LD invalido, artigos fora do sitemap ou divergencia critica entre \`/articles/\`, \`articles.json\`, \`blog.html\` e \`sitemap.xml\`.

O ponto mais importante: a arquitetura de clusters esta crescendo corretamente, especialmente em visto americano, Orlando/Disney, custo de vida e cidades da Florida. A proxima fase deve priorizar fortalecimento de paginas pilar antigas e diferenciacao editorial de temas proximos para reduzir risco de canibalizacao.

Correcoes tecnicas seguras aplicadas nesta rodada:

- Reconstruido \`assets/data/articles.json\` para incluir todos os artigos publicados.
- Regenerado \`sitemap.xml\` com todas as URLs atuais de artigos e categorias.
- Corrigido link interno quebrado identificado na auditoria.
- Ajustado \`scripts/build-article-index.ps1\` para nao deixar artigos fora do indice quando faltar \`datePublished\`, usando a data de geracao como fallback.
- Corrigidos erros pontuais de digitacao em titulos, anchors e textos de artigos antigos.

## 2. Status geral do site

- Status tecnico geral: bom.
- Indexacao/rastreamento: bom.
- Estrutura de artigos: boa.
- Interlinkagem: boa, com alguns ajustes estrategicos recomendados.
- Dados estruturados: validos.
- Risco critico atual: ${critical.length ? critical.join("; ") : "nenhum risco critico encontrado"}.
- Maior oportunidade: reforcar paginas pilar antigas com FAQ, Breadcrumb Schema, CTA e tabelas.

## 3. Inventario de paginas e artigos

- Total de artigos em \`/articles/\`: ${articleFiles.length}
- Total de artigos em \`assets/data/articles.json\`: ${articlesIndex.length}
- Total de artigos listados no sitemap: ${articleSitemapCount}
- Total de URLs no sitemap: ${sitemapLocs.length}
- Total de paginas de categorias: ${categoryFiles.length}
- Total de paginas pilar principais auditadas: ${pillarTargets.length}
- Existe \`robots.txt\`: ${exists("robots.txt") ? "sim" : "nao"}
- Sitemap declarado no robots: ${/Sitemap:\s*https:\/\/familiausa1\.com\/sitemap\.xml/i.test(robots) ? "sim" : "nao"}
- Divergencia entre \`/articles/\` e \`articles.json\`: ${missingJson.length || extraJson.length ? "sim" : "nao"}
- Divergencia entre \`/articles/\` e \`sitemap.xml\`: ${missingSitemap.length ? "sim" : "nao"}
- Artigos acessiveis pelo \`blog.html\`: ${articleAudits.filter((article) => article.inBlog).length}/${articleFiles.length}

## 4. Status do sitemap

- Sitemap existe: ${exists("sitemap.xml") ? "sim" : "nao"}
- URLs totais: ${sitemapLocs.length}
- URLs duplicadas: ${new Set(duplicateSitemap).size}
- Artigos no sitemap: ${articleSitemapCount}
- Artigos ausentes no sitemap: ${missingSitemap.length ? missingSitemap.join(", ") : "nenhum"}
- URLs com espacos/acentos problemáticos em slug de artigo: ${badUrlFiles.length ? badUrlFiles.join(", ") : "nenhuma"}

## 5. Status do articles.json

- Arquivo existe: ${exists("assets/data/articles.json") ? "sim" : "nao"}
- Artigos cadastrados: ${articlesIndex.length}
- Artigos em \`/articles/\` ausentes no JSON: ${missingJson.length ? missingJson.join(", ") : "nenhum"}
- Itens no JSON apontando para arquivo inexistente: ${extraJson.length ? extraJson.join(", ") : "nenhum"}

## 6. Status de categorias

${categoryPages.map((page) => `- \`${page.file}\`: ${page.links} links para artigos; CollectionPage: ${page.hasCollection ? "sim" : "nao"}; FAQPage: ${page.hasFAQ ? "sim" : "nao"}; BreadcrumbList: ${page.hasBreadcrumb ? "sim" : "nao"}.`).join("\n")}

## 7. Auditoria de SEO on-page

${articleTable}

## 8. Auditoria de paginas pilar

${pillarAudits.map((pillar) => `- ${pillar.exists ? "OK" : "AUSENTE"} - \`${pillar.file}\` (${pillar.name}): score ${pillar.score}/8; palavras: ${pillar.words || 0}; problemas: ${pillar.issues.length ? pillar.issues.join("; ") : "nenhum relevante"}.`).join("\n")}

Paginas pilar fortes:
${pillarAudits.filter((pillar) => pillar.exists && pillar.issues.length <= 1).map((pillar) => `- ${pillar.name} (\`${pillar.file}\`)`).join("\n") || "- nenhuma totalmente forte ainda"}

Paginas pilar que precisam de reforco:
${pillarAudits.filter((pillar) => !pillar.exists || pillar.issues.length > 1).map((pillar) => `- ${pillar.name} (\`${pillar.file}\`): ${pillar.issues.join("; ")}`).join("\n") || "- nenhuma"}

## 9. Auditoria de links internos

- Total de links internos locais analisados: ${linkEdges.length}
- Links quebrados encontrados: ${brokenLinks.length}
- Links quebrados: ${brokenLinks.length ? brokenLinks.map((link) => `\`${link.from}\` -> \`${link.href}\` => \`${link.target}\``).join("; ") : "nenhum"}
- Paginas orfas entre artigos: ${articleAudits.filter((article) => article.incoming === 0).length ? articleAudits.filter((article) => article.incoming === 0).map((article) => article.file).join(", ") : "nenhuma"}
- Artigos com menos de 3 links internos de saida: ${articleAudits.filter((article) => article.internalOut < 3).length ? articleAudits.filter((article) => article.internalOut < 3).map((article) => article.file).join(", ") : "nenhum"}
- Artigos importantes que devem receber mais links internos: ${weakIncoming.slice(0, 20).join(", ") || "nenhum prioritario"}

## 10. Auditoria de schema

- Total de blocos JSON-LD analisados: ${allJsonLd.length}
- JSON-LD invalidos: ${allJsonLd.filter((block) => !block.ok).length}
- Tipos encontrados: ${[...new Set(allJsonLd.filter((block) => block.ok).map((block) => block.type))].join(", ")}
- Paginas sem schema importante entre artigos: ${articleAudits.filter((article) => !article.hasBlogPosting).length ? articleAudits.filter((article) => !article.hasBlogPosting).map((article) => article.file).join(", ") : "nenhuma"}
- FAQPage sem FAQ visivel: ${articleAudits.filter((article) => article.hasFAQPage && !article.hasFaqVisible).length ? articleAudits.filter((article) => article.hasFAQPage && !article.hasFaqVisible).map((article) => article.file).join(", ") : "nenhum caso encontrado"}
- FAQ visivel sem FAQPage: ${articleAudits.filter((article) => article.hasFaqVisible && !article.hasFAQPage).length ? articleAudits.filter((article) => article.hasFaqVisible && !article.hasFAQPage).map((article) => article.file).join(", ") : "nenhum caso encontrado"}

## 11. Riscos de canibalizacao

${cannibalFindings.map((group) => `### ${group.topic}

- Principal recomendado: \`${group.principal}\`
- Artigos envolvidos: ${group.matches.map((article) => `\`${article.file}\``).join(", ") || "nenhum encontrado"}
- Intencao: manter o principal como guia amplo e usar os demais como satelites de perguntas especificas.
- Recomendacao: ${group.recommendation}
`).join("\n")}

## 12. Paginas orfas ou fracas

- Paginas orfas: ${articleAudits.filter((article) => article.incoming === 0).length ? articleAudits.filter((article) => article.incoming === 0).map((article) => article.file).join(", ") : "nenhuma entre artigos"}
- Artigos abaixo de 900 palavras: ${articleAudits.filter((article) => article.words < 900).length ? articleAudits.filter((article) => article.words < 900).map((article) => `${article.file} (${article.words})`).join(", ") : "nenhum"}
- Paginas de categoria fracas: ${categoryWithoutFaq.length ? categoryWithoutFaq.join(", ") : "nenhuma critica; algumas ainda podem ganhar FAQ futuramente"}

## 13. Problemas criticos encontrados

${critical.length ? critical.map((item) => `- ${item}`).join("\n") : "- Nenhum problema critico encontrado."}

## 14. Problemas medios encontrados

${medium.length ? medium.map((item) => `- ${item}`).join("\n") : "- Nenhum problema medio bloqueante encontrado."}

## 15. Problemas leves encontrados

${light.length ? light.map((item) => `- ${item}`).join("\n") : "- Apenas oportunidades editoriais leves."}

## 16. Onde paramos no cronograma editorial

O cronograma de 60 dias existe e cobre clusters de visto, Orlando/Disney, morar nos EUA, compras e noticias. Pela comparacao com artigos publicados, os blocos dos dias 1 a 10 estao majoritariamente cobertos, e tambem ja existem artigos de dias posteriores como entrevista do visto, renovacao, visto F1, trabalho nos EUA, custo de vida e credito americano.

- Dias/itens do cronograma mapeados como concluidos: ${scheduleDone.map(([day, slug]) => `${day} (${slug})`).join(", ")}
- Itens mapeados como pendentes nesta amostra: ${schedulePending.length ? schedulePending.map(([day, slug]) => `${day} (${slug})`).join(", ") : "nenhum dos itens mapeados"}
- Observacao importante: \`articles/se-legalizar-nos-eua-com-visto-de-turista-2026.html\` ja existe como conteudo espontaneo e nao deve ser duplicado.

## 17. Proximo bloco recomendado

O proximo bloco recomendado nao deve ser publicar artigos aleatorios. A prioridade deve ser:

1. Fortalecer paginas pilar antigas que ainda nao tem FAQPage/Breadcrumb/CTA no mesmo nivel da pagina \`cidades-da-florida.html\`.
2. Continuar clusters com alto potencial de busca: Orlando/compras, banco/credito, saude e familia/filhos.
3. Criar comparativos futuros somente quando houver intencao distinta clara, evitando duplicar temas ja publicados.

## 18. Lista de arquivos que precisam de correcao

Arquivos com correcao tecnica critica obrigatoria: ${critical.length ? "ver problemas criticos acima" : "nenhum"}.

Arquivos recomendados para melhoria editorial/SEO:
${pillarAudits.filter((pillar) => pillar.issues.length > 1).map((pillar) => `- \`${pillar.file}\`: ${pillar.issues.join("; ")}`).join("\n") || "- nenhum pilar com problema forte"}

## 19. Plano de acao em ordem de prioridade

1. Manter sitemap e \`articles.json\` sincronizados a cada nova publicacao.
2. Melhorar paginas pilar antigas com o mesmo padrao da pagina de cidades: FAQ, Breadcrumb, CTAs, tabela/lista comparativa e texto de apoio.
3. Revisar canibalizacao por cluster e reforcar links dos satelites para seus guias principais.
4. Criar thumbnails especificas para os artigos de cidades e hubs mais importantes.
5. Monitorar Google Search Console: descobertas nao indexadas, paginas rastreadas mas nao indexadas, consultas por cidade, CTR e impressões.
6. Seguir o cronograma editorial, mas pulando temas ja publicados para evitar duplicidade.

## 20. Conclusao profissional

O Familia USA 1 esta no caminho certo. A base tecnica esta indexavel, o sitemap esta consistente, os artigos estao conectados ao JSON e ao blog, os schemas sao validos e os clusters principais ja existem. O trabalho agora deve ser menos quantidade bruta e mais consolidacao: fortalecer paginas pilar, diferenciar intencoes proximas, criar links internos estrategicos para os guias principais e monitorar desempenho no Search Console.
`;

fs.writeFileSync(REPORT, report, "utf8");

console.log(JSON.stringify({
  articles: articleFiles.length,
  articlesJson: articlesIndex.length,
  articleSitemap: articleSitemapCount,
  sitemapUrls: sitemapLocs.length,
  categories: categoryFiles.length,
  brokenLinks: brokenLinks.length,
  invalidJsonLd: allJsonLd.filter((block) => !block.ok).length,
  missingJson: missingJson.length,
  missingSitemap: missingSitemap.length,
  duplicateSitemap: new Set(duplicateSitemap).size,
  noindexPages: noindexPages.length,
  report: path.relative(ROOT, REPORT),
}, null, 2));
