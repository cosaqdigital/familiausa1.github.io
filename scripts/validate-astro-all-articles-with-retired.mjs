import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const dist = path.join(root, "dist");
const legacyPath = path.join(root, "src", "data", "legacy-extract", "legacy-articles.json");
const retiredPath = path.join(root, "src", "data", "retired-articles.json");
const activeValidatorPath = path.join(root, "scripts", "validate-astro-all-articles.mjs");
const distSitemapPath = path.join(dist, "sitemap.xml");
const siteUrl = "https://familiausa1.com";

function attrTag(html, attributeName, attributeValue) {
  const pattern = new RegExp(`<[^>]+\\b${attributeName}=["']${attributeValue}["'][^>]*>`, "i");
  return html.match(pattern)?.[0] ?? "";
}

function canonicalOf(html) {
  return html.match(/<link\b[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i)?.[1]?.trim()
    ?? html.match(/<link\b[^>]*href=["']([^"']+)["'][^>]*rel=["']canonical["'][^>]*>/i)?.[1]?.trim()
    ?? null;
}

function countMatches(html, pattern) {
  return [...html.matchAll(pattern)].length;
}

if (!fs.existsSync(legacyPath)) {
  console.error(`Arquivo legado nao encontrado: ${path.relative(root, legacyPath)}`);
  process.exit(1);
}

if (!fs.existsSync(retiredPath)) {
  console.error(`Mapa de artigos aposentados nao encontrado: ${path.relative(root, retiredPath)}`);
  process.exit(1);
}

const originalLegacyText = fs.readFileSync(legacyPath, "utf8");
const legacy = JSON.parse(originalLegacyText);
const retiredData = JSON.parse(fs.readFileSync(retiredPath, "utf8"));
const retired = retiredData.redirects ?? [];
const retiredSlugs = new Set(retired.map((item) => item.slug));
const redirectErrors = [];

const distSitemap = fs.existsSync(distSitemapPath) ? fs.readFileSync(distSitemapPath, "utf8") : "";

for (const item of retired) {
  const sourcePath = `/articles/${item.slug}.html`;
  const targetPath = `/articles/${item.targetSlug}.html`;
  const relativeFile = sourcePath.slice(1);
  const distFile = path.join(dist, relativeFile);
  const targetFile = path.join(dist, targetPath.slice(1));
  const expectedCanonical = `${siteUrl}${targetPath}`;

  if (!fs.existsSync(distFile)) {
    redirectErrors.push(`${relativeFile}: pagina de redirecionamento nao foi gerada.`);
    continue;
  }

  if (!fs.existsSync(targetFile)) {
    redirectErrors.push(`${relativeFile}: destino nao foi gerado em dist (${targetPath}).`);
  }

  const html = fs.readFileSync(distFile, "utf8");
  const canonical = canonicalOf(html);
  const robotsTag = attrTag(html, "name", "robots");
  const refreshTag = attrTag(html, "http-equiv", "refresh");
  const h1Count = countMatches(html, /<h1\b/gi);

  if (!/^<!doctype html>/i.test(html.trim())) {
    redirectErrors.push(`${relativeFile}: DOCTYPE ausente.`);
  }
  if (!/<html\b[^>]*lang=["']pt-BR["']/i.test(html)) {
    redirectErrors.push(`${relativeFile}: html lang pt-BR ausente.`);
  }
  if (!/<title>[\s\S]+?<\/title>/i.test(html)) {
    redirectErrors.push(`${relativeFile}: title ausente.`);
  }
  if (!/<meta\b[^>]*name=["']description["'][^>]*content=["'][^"']+["'][^>]*>/i.test(html)) {
    redirectErrors.push(`${relativeFile}: meta description ausente.`);
  }
  if (!robotsTag || !/noindex/i.test(robotsTag) || !/follow/i.test(robotsTag)) {
    redirectErrors.push(`${relativeFile}: robots deve conter noindex, follow.`);
  }
  if (canonical !== expectedCanonical) {
    redirectErrors.push(`${relativeFile}: canonical ${canonical ?? "ausente"}; esperado ${expectedCanonical}.`);
  }
  if (!refreshTag || !/content=["'][^"']*0\s*;\s*url=/i.test(refreshTag) || !refreshTag.includes(targetPath)) {
    redirectErrors.push(`${relativeFile}: meta refresh nao aponta para ${targetPath}.`);
  }
  if (!/window\.location\.replace\s*\(/i.test(html)) {
    redirectErrors.push(`${relativeFile}: window.location.replace ausente.`);
  }
  if (h1Count !== 1) {
    redirectErrors.push(`${relativeFile}: H1 deve ser unico; encontrado ${h1Count}.`);
  }
  if (!html.includes(`href="${targetPath}"`) && !html.includes(`href='${targetPath}'`)) {
    redirectErrors.push(`${relativeFile}: link de fallback para o destino ausente.`);
  }
  if (retiredSlugs.has(item.targetSlug)) {
    redirectErrors.push(`${relativeFile}: destino tambem esta aposentado; cadeia de redirecionamento nao permitida.`);
  }

  if (distSitemap) {
    if (distSitemap.includes(`<loc>${siteUrl}${sourcePath}</loc>`)) {
      redirectErrors.push(`${relativeFile}: URL aposentada ainda aparece no sitemap gerado.`);
    }
    if (!distSitemap.includes(`<loc>${expectedCanonical}</loc>`)) {
      redirectErrors.push(`${relativeFile}: destino ${expectedCanonical} nao aparece no sitemap gerado.`);
    }
  }
}

if (redirectErrors.length > 0) {
  console.error(redirectErrors.join("\n"));
  console.error(`Validacao de redirecionamentos aposentados falhou: ${redirectErrors.length} erro(s).`);
  process.exit(1);
}

const activeLegacy = {
  ...legacy,
  articles: (legacy.articles ?? []).filter((article) => !retiredSlugs.has(article.slug))
};

let validatorStatus = 1;
try {
  fs.writeFileSync(legacyPath, `${JSON.stringify(activeLegacy, null, 2)}\n`, "utf8");
  const result = spawnSync(process.execPath, [activeValidatorPath], {
    cwd: root,
    stdio: "inherit"
  });
  validatorStatus = result.status ?? 1;
} finally {
  fs.writeFileSync(legacyPath, originalLegacyText, "utf8");
}

if (validatorStatus !== 0) {
  process.exit(validatorStatus);
}

console.log(`Redirects aposentados validados: ${retired.length}, 0 erros criticos.`);
console.log(`Artigos legados ativos validados: ${activeLegacy.articles.length}.`);
