const fs = require("node:fs");
const path = require("node:path");

const SITE_URL = "https://familiausa1.com";
const ARTICLE_INDEX = path.join(__dirname, "..", "assets", "data", "articles.json");
const OUTPUT = path.join(__dirname, "..", "sitemap.xml");

function formatDate(value) {
  const match = String(value || "").match(/^\d{4}-\d{2}-\d{2}/);
  return match ? match[0] : null;
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function addUrl(entries, seen, loc, lastmod) {
  const normalizedLoc = loc.replace(/([^:]\/)\/+/g, "$1");
  if (seen.has(normalizedLoc)) {
    return;
  }

  seen.add(normalizedLoc);
  entries.push({
    loc: normalizedLoc,
    lastmod: formatDate(lastmod),
  });
}

const index = JSON.parse(fs.readFileSync(ARTICLE_INDEX, "utf8"));
const articles = Array.isArray(index.articles) ? index.articles : [];
const latestArticleDate = articles
  .map((article) => formatDate(article.modified) || formatDate(article.date))
  .filter(Boolean)
  .sort()
  .at(-1) || formatDate(index.generatedAt) || new Date().toISOString().slice(0, 10);

const entries = [];
const seen = new Set();

addUrl(entries, seen, `${SITE_URL}/`, latestArticleDate);
addUrl(entries, seen, `${SITE_URL}/blog.html`, latestArticleDate);
addUrl(entries, seen, `${SITE_URL}/categorias.html`, latestArticleDate);
addUrl(entries, seen, `${SITE_URL}/sobre.html`, latestArticleDate);

for (const article of articles) {
  if (!article.url) {
    continue;
  }

  const articleDate = formatDate(article.modified) || formatDate(article.date) || latestArticleDate;
  addUrl(entries, seen, `${SITE_URL}/${article.url}`, articleDate);
}

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...entries.map((entry) => [
    "  <url>",
    `    <loc>${escapeXml(entry.loc)}</loc>`,
    `    <lastmod>${escapeXml(entry.lastmod)}</lastmod>`,
    "  </url>",
  ].join("\n")),
  "</urlset>",
  "",
].join("\n");

fs.writeFileSync(OUTPUT, xml, { encoding: "utf8" });
console.log(`Sitemap generated at sitemap.xml with ${entries.length} URLs.`);
