import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const DIST = path.join(ROOT, "dist");
const ARTICLES_DIR = path.join(DIST, "articles");
const REPORT_DIR = path.join(DIST, "reports");

const STOPWORDS = new Set([
  "a", "as", "ao", "aos", "aquela", "aquele", "aqueles", "aqui", "com", "como", "da", "das", "de", "do", "dos",
  "e", "ela", "ele", "em", "entre", "era", "essa", "esse", "esta", "este", "eu", "foi", "ha", "isso", "ja", "mais",
  "mas", "na", "nas", "no", "nos", "o", "os", "ou", "para", "pela", "pelo", "por", "porque", "que", "se", "sem",
  "ser", "sua", "suas", "seu", "seus", "tambem", "tem", "uma", "um", "voce", "voces", "eua", "estados", "unidos",
  "brasileiro", "brasileiros", "2026", "familiausa1"
]);

function htmlFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter((name) => name.endsWith(".html"))
    .map((name) => path.join(dir, name));
}

function decodeEntities(value = "") {
  return value
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">");
}

function stripHtml(value = "") {
  return decodeEntities(value)
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalize(value = "") {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function words(value = "") {
  return normalize(value).split(" ").filter(Boolean);
}

function contentTokens(value = "") {
  return words(value).filter((token) => token.length > 2 && !STOPWORDS.has(token));
}

function shingles(value, size = 5) {
  const tokens = contentTokens(value);
  const set = new Set();
  for (let index = 0; index <= tokens.length - size; index += 1) {
    set.add(tokens.slice(index, index + size).join(" "));
  }
  return set;
}

function jaccardSets(left, right) {
  if (!left.size || !right.size) return 0;
  let intersection = 0;
  const smaller = left.size <= right.size ? left : right;
  const larger = left.size <= right.size ? right : left;
  for (const item of smaller) if (larger.has(item)) intersection += 1;
  return intersection / (left.size + right.size - intersection);
}

function titleTokens(value) {
  return new Set(contentTokens(value));
}

function extract(html, pattern) {
  return pattern.exec(html)?.[1] || "";
}

function extractArticleBody(html) {
  const section = extract(
    html,
    /<section\b[^>]*class=["'][^"']*\barticle-content\b[^"']*["'][^>]*>([\s\S]*?)<\/section>/i
  );
  if (section) return section;
  return extract(html, /<article\b[^>]*>([\s\S]*)<\/article>/i);
}

function extractTitle(html) {
  return stripHtml(extract(html, /<h1\b[^>]*>([\s\S]*?)<\/h1>/i));
}

function countMatches(value, pattern) {
  return [...value.matchAll(pattern)].length;
}

if (!fs.existsSync(ARTICLES_DIR)) {
  throw new Error("dist/articles nao encontrado. Execute npm run build antes da auditoria.");
}

const articles = htmlFiles(ARTICLES_DIR).map((file) => {
  const html = fs.readFileSync(file, "utf8");
  const bodyHtml = extractArticleBody(html);
  const text = stripHtml(bodyHtml);
  const slug = path.basename(file, ".html");
  const title = extractTitle(html) || slug;
  const wordCount = words(text).length;
  const headings = countMatches(bodyHtml, /<h[2-4]\b/gi);
  const paragraphs = countMatches(bodyHtml, /<p\b/gi);
  const lists = countMatches(bodyHtml, /<(?:ul|ol)\b/gi);

  return {
    slug,
    title,
    wordCount,
    headings,
    paragraphs,
    lists,
    bodyText: text,
    titleSet: titleTokens(title),
    shingleSet: shingles(text)
  };
});

const pairs = [];
for (let leftIndex = 0; leftIndex < articles.length; leftIndex += 1) {
  for (let rightIndex = leftIndex + 1; rightIndex < articles.length; rightIndex += 1) {
    const left = articles[leftIndex];
    const right = articles[rightIndex];
    const bodySimilarity = jaccardSets(left.shingleSet, right.shingleSet);
    const titleSimilarity = jaccardSets(left.titleSet, right.titleSet);

    if (bodySimilarity >= 0.08 || titleSimilarity >= 0.45) {
      pairs.push({
        left: left.slug,
        right: right.slug,
        bodySimilarity: Number(bodySimilarity.toFixed(3)),
        titleSimilarity: Number(titleSimilarity.toFixed(3))
      });
    }
  }
}

pairs.sort((a, b) => b.bodySimilarity - a.bodySimilarity || b.titleSimilarity - a.titleSimilarity);

const inboundSimilarity = new Map(articles.map((article) => [article.slug, []]));
for (const pair of pairs) {
  inboundSimilarity.get(pair.left)?.push(pair);
  inboundSimilarity.get(pair.right)?.push(pair);
}

const rows = articles.map((article) => {
  const relatedPairs = inboundSimilarity.get(article.slug) || [];
  const strongestBodyPair = [...relatedPairs].sort((a, b) => b.bodySimilarity - a.bodySimilarity)[0];
  const strongestTitlePair = [...relatedPairs].sort((a, b) => b.titleSimilarity - a.titleSimilarity)[0];
  const strongestBody = strongestBodyPair?.bodySimilarity || 0;
  const strongestTitle = strongestTitlePair?.titleSimilarity || 0;

  const signals = [];
  if (article.wordCount < 700) signals.push("muito_curto");
  else if (article.wordCount < 900) signals.push("curto");
  if (article.headings < 3 && article.wordCount >= 900) signals.push("pouca_estrutura");
  if (strongestBody >= 0.28) signals.push("similaridade_corporal_alta");
  else if (strongestBody >= 0.16) signals.push("similaridade_corporal_media");
  if (strongestTitle >= 0.65) signals.push("intencao_titulo_muito_proxima");

  let risk = "baixo";
  if (signals.includes("muito_curto") || signals.includes("similaridade_corporal_alta")) risk = "alto";
  else if (signals.length >= 2 || signals.includes("curto") || signals.includes("similaridade_corporal_media")) risk = "medio";

  return {
    slug: article.slug,
    title: article.title,
    wordCount: article.wordCount,
    headings: article.headings,
    paragraphs: article.paragraphs,
    lists: article.lists,
    strongestBodySimilarity: strongestBody,
    strongestTitleSimilarity: strongestTitle,
    risk,
    signals
  };
}).sort((a, b) => {
  const weight = { alto: 2, medio: 1, baixo: 0 };
  return weight[b.risk] - weight[a.risk] || a.wordCount - b.wordCount;
});

const highRisk = rows.filter((row) => row.risk === "alto");
const mediumRisk = rows.filter((row) => row.risk === "medio");
const thin = rows.filter((row) => row.wordCount < 900).sort((a, b) => a.wordCount - b.wordCount);
const highBodyPairs = pairs.filter((pair) => pair.bodySimilarity >= 0.28);
const mediumBodyPairs = pairs.filter((pair) => pair.bodySimilarity >= 0.16 && pair.bodySimilarity < 0.28);
const highTitlePairs = pairs.filter((pair) => pair.titleSimilarity >= 0.65);

console.log(`Auditoria de qualidade: ${articles.length} artigos renderizados.`);
console.log(`Risco alto: ${highRisk.length}.`);
console.log(`Risco medio: ${mediumRisk.length}.`);
console.log(`Abaixo de 900 palavras: ${thin.length}.`);
console.log(`Pares com similaridade corporal alta (>= 0.28): ${highBodyPairs.length}.`);
console.log(`Pares com similaridade corporal media (0.16-0.279): ${mediumBodyPairs.length}.`);
console.log(`Pares com titulo muito proximo (>= 0.65): ${highTitlePairs.length}.`);

function printRows(label, items, limit = 30) {
  console.log(`\n${label}`);
  if (!items.length) {
    console.log("- nenhum");
    return;
  }
  for (const item of items.slice(0, limit)) {
    if (item.left) {
      console.log(`- ${item.left} <-> ${item.right}: corpo=${item.bodySimilarity}, titulo=${item.titleSimilarity}`);
    } else {
      console.log(`- ${item.slug}: ${item.wordCount} palavras; risco=${item.risk}; sinais=${item.signals.join(",") || "nenhum"}`);
    }
  }
  if (items.length > limit) console.log(`- ... e mais ${items.length - limit}`);
}

printRows("Artigos de maior risco", highRisk);
printRows("Artigos abaixo de 900 palavras", thin);
printRows("Pares mais semelhantes pelo corpo", highBodyPairs.length ? highBodyPairs : pairs.slice(0, 30));
printRows("Pares com titulos/intencoes muito proximos", highTitlePairs);

fs.mkdirSync(REPORT_DIR, { recursive: true });
fs.writeFileSync(
  path.join(REPORT_DIR, "content-quality-audit.json"),
  `${JSON.stringify({
    generatedAt: new Date().toISOString(),
    thresholds: {
      veryThinWords: 700,
      thinWords: 900,
      mediumBodySimilarity: 0.16,
      highBodySimilarity: 0.28,
      highTitleSimilarity: 0.65
    },
    summary: {
      articles: articles.length,
      highRisk: highRisk.length,
      mediumRisk: mediumRisk.length,
      below900Words: thin.length,
      highBodyPairs: highBodyPairs.length,
      mediumBodyPairs: mediumBodyPairs.length,
      highTitlePairs: highTitlePairs.length
    },
    rows,
    pairs: pairs.slice(0, 200)
  }, null, 2)}\n`,
  "utf8"
);
