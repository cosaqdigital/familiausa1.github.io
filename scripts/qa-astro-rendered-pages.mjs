import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const dist = path.join(root, "dist");
const reportPath = path.join(root, "src", "data", "legacy-extract", "visual-qa-batch-20-report.md");
const batchPath = path.join(root, "src", "data", "legacy-extract", "migration-batch-20.json");
const batch = JSON.parse(fs.readFileSync(batchPath, "utf8"));
const articlesBySlug = new Map((batch.articles ?? []).map((article) => [article.slug, article]));

const inspectedSlugs = [
  "custo-de-vida-nos-eua-2026-atualizado",
  "morar-legalmente-nos-eua-caminhos-possiveis-2026",
  "asilo-nos-estados-unidos-2026",
  "morar-em-boston-2026",
  "cidades-da-florida-com-mais-brasileiros-2026",
  "formas-legais-conseguir-green-card-eua-2026",
  "guia-completo-visto-americano-2026",
  "morar-em-framingham-massachusetts-2026"
];

const batchSlugs = new Set((batch.articles ?? []).map((article) => article.slug));
const results = [];
const criticalErrors = [];

function countMatches(html, pattern) {
  return [...html.matchAll(pattern)].length;
}

function stripTags(value = "") {
  return value
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractMainArticleHtml(html) {
  const match = html.match(/<section\b[^>]*class=["'][^"']*\barticle-content\b[^"']*["'][^>]*>\s*<article>([\s\S]*?)<\/article>\s*<\/section>/i);
  return match?.[1]?.trim() ?? "";
}

function normalizeTarget(currentFile, href) {
  const cleanHref = href.replace(/#.*$/, "");
  if (!cleanHref || /^(https?:|mailto:|tel:|#)/i.test(cleanHref)) return null;
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

function checkPage(slug) {
  const article = articlesBySlug.get(slug);
  const relativeFile = `articles/${slug}.html`;
  const fullPath = path.join(dist, relativeFile);
  const pageErrors = [];
  const warnings = [];

  if (!article) {
    pageErrors.push("Artigo nao encontrado em migration-batch-20.json.");
    criticalErrors.push(`${relativeFile}: artigo ausente no lote.`);
    return { slug, relativeFile, exists: false, pageErrors, warnings };
  }

  if (!fs.existsSync(fullPath)) {
    pageErrors.push("Arquivo nao encontrado em dist.");
    criticalErrors.push(`${relativeFile}: arquivo nao encontrado em dist.`);
    return { slug, relativeFile, exists: false, pageErrors, warnings, article };
  }

  const html = fs.readFileSync(fullPath, "utf8");
  const mainArticleHtml = extractMainArticleHtml(html);
  const mainText = stripTags(mainArticleHtml);
  const currentFile = relativeFile;

  const articleHeaderIndex = html.indexOf("article-header");
  const articleContentIndex = html.indexOf("article-content");
  const breadcrumbIndex = html.indexOf("breadcrumb");
  const globalFooterCount = countMatches(html, /class=["'][^"']*\bsite-footer\b/gi);
  const globalHeaderCount = countMatches(html, /class=["'][^"']*\bsite-header\b/gi);
  const gtagScriptCount = countMatches(html, /googletagmanager\.com\/gtag\/js\?id=G-5RND6F4L8G/gi);
  const gtagConfigCount = countMatches(html, /gtag\('config',\s*'G-5RND6F4L8G'\)/gi);
  const h1Count = countMatches(html, /<h1\b/gi);
  const generatedFaqPage = /"@type"\s*:\s*"FAQPage"/.test(html);
  const generatedBlogPosting = /"@type"\s*:\s*"BlogPosting"/.test(html);
  const escapedTags = findVisibleEscapedTags(mainArticleHtml);
  const linksWithinBatchBroken = [];

  const legacyCounts = {
    quickSummary: /quick-summary/.test(article.articleContentHtml ?? ""),
    tables: countMatches(article.articleContentHtml ?? "", /<table\b/gi),
    unorderedLists: countMatches(article.articleContentHtml ?? "", /<ul\b/gi),
    orderedLists: countMatches(article.articleContentHtml ?? "", /<ol\b/gi),
    faqQuestions: article.visibleFaqs?.length ?? 0,
    checklistCta: /checklist|checklist-cta/i.test(article.articleContentHtml ?? "")
  };

  const distCounts = {
    quickSummary: /quick-summary/.test(mainArticleHtml),
    tables: countMatches(mainArticleHtml, /<table\b/gi),
    unorderedLists: countMatches(mainArticleHtml, /<ul\b/gi),
    orderedLists: countMatches(mainArticleHtml, /<ol\b/gi),
    faqHeadings: countMatches(mainArticleHtml, /<h3\b/gi),
    checklistCta: /checklist|checklist-cta/i.test(mainArticleHtml)
  };

  if (!/^<!doctype html>/i.test(html.trim())) pageErrors.push("DOCTYPE ausente.");
  if (!/<html lang="pt-BR">/i.test(html)) pageErrors.push("html lang pt-BR ausente.");
  if (h1Count !== 1) pageErrors.push(`H1 deve ser unico; encontrado ${h1Count}.`);
  if (gtagScriptCount !== 1 || gtagConfigCount !== 1) pageErrors.push(`GA deveria aparecer uma vez; script=${gtagScriptCount}, config=${gtagConfigCount}.`);
  if (!html.includes(`rel="canonical" href="${article.canonical}"`)) pageErrors.push("Canonical diferente do legado.");
  if (!generatedBlogPosting) pageErrors.push("BlogPosting ausente.");
  if (legacyCounts.faqQuestions > 0 && !generatedFaqPage) pageErrors.push("FAQPage ausente apesar de FAQ visivel.");
  if (html.includes("PLACEHOLDER")) pageErrors.push("PLACEHOLDER encontrado.");
  if (!mainArticleHtml) pageErrors.push("Conteudo principal nao localizado.");
  if (mainText.length < 1000) warnings.push(`Conteudo principal possivelmente curto para QA visual: ${mainText.length} caracteres de texto.`);
  if (/site-header|site-footer|googletagmanager\.com|G-5RND6F4L8G/i.test(mainArticleHtml)) pageErrors.push("Header, footer ou script antigo de GA dentro do conteudo principal.");
  if (globalHeaderCount !== 1) pageErrors.push(`Header global duplicado/ausente; encontrado ${globalHeaderCount}.`);
  if (globalFooterCount !== 1) pageErrors.push(`Footer global duplicado/ausente; encontrado ${globalFooterCount}.`);
  if (escapedTags.length > 0) pageErrors.push(`Tags HTML parecem visiveis como texto: ${escapedTags.join(", ")}.`);
  if (articleHeaderIndex < 0 || articleContentIndex < 0 || articleHeaderIndex > articleContentIndex) pageErrors.push("article-header nao aparece antes de article-content.");
  if (breadcrumbIndex < 0 || breadcrumbIndex > articleContentIndex) warnings.push("Breadcrumb ausente ou depois do conteudo.");
  if (legacyCounts.quickSummary && !distCounts.quickSummary) pageErrors.push("quick-summary existia no legado e nao apareceu no dist.");
  if (distCounts.tables < legacyCounts.tables) pageErrors.push(`Tabelas nao preservadas; legado=${legacyCounts.tables}, dist=${distCounts.tables}.`);
  if (distCounts.unorderedLists < legacyCounts.unorderedLists) pageErrors.push(`Listas <ul> nao preservadas; legado=${legacyCounts.unorderedLists}, dist=${distCounts.unorderedLists}.`);
  if (distCounts.orderedLists < legacyCounts.orderedLists) pageErrors.push(`Listas <ol> nao preservadas; legado=${legacyCounts.orderedLists}, dist=${distCounts.orderedLists}.`);
  if (legacyCounts.faqQuestions > 0 && distCounts.faqHeadings < legacyCounts.faqQuestions) warnings.push(`FAQ visivel pode estar incompleta; perguntas=${legacyCounts.faqQuestions}, h3 no conteudo=${distCounts.faqHeadings}.`);
  if (legacyCounts.checklistCta && !distCounts.checklistCta) warnings.push("CTA/checklist existia no legado e nao foi detectado no conteudo principal.");

  for (const match of html.matchAll(/href="([^"]+)"/g)) {
    const target = normalizeTarget(currentFile, match[1]);
    if (!target) continue;
    const targetSlug = slugFromTarget(target);
    if (!targetSlug || !batchSlugs.has(targetSlug)) continue;
    if (!fs.existsSync(path.join(dist, target))) {
      linksWithinBatchBroken.push(match[1]);
    }
  }

  if (linksWithinBatchBroken.length > 0) {
    pageErrors.push(`Links internos do lote quebrados: ${linksWithinBatchBroken.join(", ")}.`);
  }

  for (const error of pageErrors) {
    criticalErrors.push(`${relativeFile}: ${error}`);
  }

  return {
    slug,
    relativeFile,
    exists: true,
    article,
    pageErrors,
    warnings,
    metrics: {
      h1Count,
      gtagScriptCount,
      gtagConfigCount,
      globalHeaderCount,
      globalFooterCount,
      articleHeaderBeforeContent: articleHeaderIndex >= 0 && articleContentIndex >= 0 && articleHeaderIndex < articleContentIndex,
      breadcrumbBeforeContent: breadcrumbIndex >= 0 && breadcrumbIndex < articleContentIndex,
      mainTextLength: mainText.length,
      legacyCounts,
      distCounts,
      generatedBlogPosting,
      generatedFaqPage,
      linksWithinBatchBroken
    }
  };
}

for (const slug of inspectedSlugs) {
  results.push(checkPage(slug));
}

const lines = [];
lines.push("# QA visual tecnico do lote Astro de 20 artigos");
lines.push("");
lines.push(`Gerado em: \`${new Date().toISOString()}\``);
lines.push("Escopo: 8 paginas renderizadas em `dist/articles/` a partir do lote Astro de 20 artigos.");
lines.push("Metodo: inspecao tecnica do HTML renderizado, sem navegador e sem screenshots.");
lines.push("");
lines.push("## Resumo");
lines.push("");
lines.push(`- Paginas inspecionadas: ${results.length}`);
lines.push(`- Paginas sem erro critico: ${results.filter((result) => result.pageErrors.length === 0).length}/${results.length}`);
lines.push(`- Erros criticos encontrados: ${criticalErrors.length}`);
lines.push(`- Avisos visuais provaveis: ${results.reduce((total, result) => total + result.warnings.length, 0)}`);
lines.push("");

lines.push("## Resultado por pagina");
lines.push("");
lines.push("| Pagina | Status | H1 | GA | BlogPosting | FAQPage | Header/Footer | Conteudo | Tabelas | Listas | Avisos |");
lines.push("| --- | --- | ---: | --- | --- | --- | --- | ---: | --- | --- | ---: |");

for (const result of results) {
  const metrics = result.metrics;
  const status = result.pageErrors.length === 0 ? "ok" : "erro";
  lines.push([
    `| \`${result.relativeFile}\``,
    status,
    metrics?.h1Count ?? 0,
    metrics ? `${metrics.gtagScriptCount}/${metrics.gtagConfigCount}` : "0/0",
    metrics?.generatedBlogPosting ? "sim" : "nao",
    metrics?.generatedFaqPage ? "sim" : "nao",
    metrics ? `${metrics.globalHeaderCount}/${metrics.globalFooterCount}` : "0/0",
    metrics?.mainTextLength ?? 0,
    metrics ? `${metrics.distCounts.tables}/${metrics.legacyCounts.tables}` : "0/0",
    metrics ? `${metrics.distCounts.unorderedLists + metrics.distCounts.orderedLists}/${metrics.legacyCounts.unorderedLists + metrics.legacyCounts.orderedLists}` : "0/0",
    `${result.warnings.length} |`
  ].join(" | "));
}

lines.push("");
lines.push("## Problemas encontrados");
lines.push("");
if (criticalErrors.length === 0) {
  lines.push("- Nenhum erro critico encontrado nas 8 paginas inspecionadas.");
} else {
  for (const error of criticalErrors) {
    lines.push(`- ${error}`);
  }
}

lines.push("");
lines.push("## Avisos e riscos visuais provaveis");
lines.push("");
const warnings = results.flatMap((result) => result.warnings.map((warning) => ({ page: result.relativeFile, warning })));
if (warnings.length === 0) {
  lines.push("- Nenhum aviso visual relevante detectado por HTML.");
} else {
  for (const item of warnings) {
    lines.push(`- \`${item.page}\`: ${item.warning}`);
  }
}

lines.push("");
lines.push("## Detalhe por pagina");
for (const result of results) {
  lines.push("");
  lines.push(`### ${result.relativeFile}`);
  if (!result.exists) {
    lines.push("- Arquivo nao existe em dist.");
    continue;
  }
  const metrics = result.metrics;
  lines.push(`- Canonical legado: ${result.article.canonical}`);
  lines.push(`- H1 unico: ${metrics.h1Count === 1 ? "sim" : "nao"} (${metrics.h1Count})`);
  lines.push(`- GA unico: ${metrics.gtagScriptCount === 1 && metrics.gtagConfigCount === 1 ? "sim" : "nao"} (script ${metrics.gtagScriptCount}, config ${metrics.gtagConfigCount})`);
  lines.push(`- BlogPosting: ${metrics.generatedBlogPosting ? "sim" : "nao"}`);
  lines.push(`- FAQPage: ${metrics.generatedFaqPage ? "sim" : "nao"}`);
  lines.push(`- article-header antes de article-content: ${metrics.articleHeaderBeforeContent ? "sim" : "nao"}`);
  lines.push(`- Breadcrumb antes do conteudo: ${metrics.breadcrumbBeforeContent ? "sim" : "nao"}`);
  lines.push(`- quick-summary preservado: ${metrics.legacyCounts.quickSummary ? (metrics.distCounts.quickSummary ? "sim" : "nao") : "nao existia no legado"}`);
  lines.push(`- Tabelas preservadas: ${metrics.distCounts.tables}/${metrics.legacyCounts.tables}`);
  lines.push(`- Listas preservadas: ${metrics.distCounts.unorderedLists + metrics.distCounts.orderedLists}/${metrics.legacyCounts.unorderedLists + metrics.legacyCounts.orderedLists}`);
  lines.push(`- Links internos do lote quebrados: ${metrics.linksWithinBatchBroken.length}`);
  if (result.pageErrors.length > 0) {
    lines.push("- Erros:");
    result.pageErrors.forEach((error) => lines.push(`  - ${error}`));
  }
  if (result.warnings.length > 0) {
    lines.push("- Avisos:");
    result.warnings.forEach((warning) => lines.push(`  - ${warning}`));
  }
}

lines.push("");
lines.push("## Recomendacao");
lines.push("");
if (criticalErrors.length === 0) {
  lines.push("As 8 paginas inspecionadas passaram na QA tecnica do HTML renderizado. O lote preserva estrutura essencial, SEO, FAQPage automatico, tabelas, listas, links internos do lote e layout global sem duplicar header/footer/GA dentro do conteudo.");
  lines.push("Recomendacao: a base esta pronta para uma proxima etapa de ampliacao controlada. Antes de gerar os 151 artigos, vale fazer uma checagem visual com navegador em algumas paginas longas e com tabelas para ajustar detalhes finos de spacing/legibilidade, mas nao ha bloqueio tecnico nesta QA.");
} else {
  lines.push("Recomendacao: corrigir os erros criticos listados antes de ampliar para os 151 artigos.");
}

fs.writeFileSync(reportPath, `${lines.join("\n").replace(/\n+$/, "")}\n`, "utf8");

if (criticalErrors.length > 0) {
  console.error(criticalErrors.join("\n"));
  console.error(`Relatorio gerado em ${path.relative(root, reportPath)}`);
  process.exit(1);
}

console.log(`QA renderizada aprovada: ${results.length} paginas inspecionadas, 0 erros criticos.`);
console.log(`Relatorio: ${path.relative(root, reportPath).replaceAll("\\", "/")}`);
