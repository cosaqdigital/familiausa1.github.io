import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const legacyPath = path.join(root, "src", "data", "legacy-extract", "legacy-articles.json");
const markdownDir = path.join(root, "src", "content", "articles");
const validatorPath = path.join(root, "scripts", "validate-astro-site-structure.mjs");

function scalar(frontmatter, key) {
  const match = frontmatter.match(new RegExp(`^${key}:\\s*(.+)$`, "m"));
  return match ? match[1].trim().replace(/^['\"]|['\"]$/g, "").trim() : "";
}

function activeMarkdownSlugs() {
  if (!fs.existsSync(markdownDir)) return new Set();

  const slugs = new Set();
  for (const file of fs.readdirSync(markdownDir)) {
    if (!/\.mdx?$/.test(file) || file.startsWith("_")) continue;
    const markdown = fs.readFileSync(path.join(markdownDir, file), "utf8");
    const frontmatter = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? "";
    if (scalar(frontmatter, "draft") !== "false") continue;
    slugs.add(scalar(frontmatter, "slug") || file.replace(/\.mdx?$/, ""));
  }
  return slugs;
}

const original = fs.readFileSync(legacyPath, "utf8");
const parsed = JSON.parse(original);
const markdownSlugs = activeMarkdownSlugs();
const originalCount = Array.isArray(parsed.articles) ? parsed.articles.length : 0;

parsed.articles = (parsed.articles ?? []).filter((article) => !markdownSlugs.has(article.slug));
const replacements = originalCount - parsed.articles.length;

try {
  fs.writeFileSync(legacyPath, `${JSON.stringify(parsed, null, 2)}\n`, "utf8");
  console.log(`Validacao estrutural: ${replacements} artigo(s) legado(s) substituido(s) por Markdown foram deduplicados temporariamente.`);

  const result = spawnSync(process.execPath, [validatorPath], {
    cwd: root,
    stdio: "inherit"
  });

  if (result.error) throw result.error;
  process.exitCode = result.status ?? 1;
} finally {
  fs.writeFileSync(legacyPath, original, "utf8");
}
