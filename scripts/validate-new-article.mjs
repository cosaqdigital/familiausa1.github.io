import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const contentDir = path.join(root, "src", "content", "articles");
const categoriesPath = path.join(root, "src", "data", "categories.ts");
const distArticlesDir = path.join(root, "dist", "articles");
const siteUrl = "https://familiausa1.com";
const errors = [];
const warnings = [];

function stripQuotes(value = "") {
  return String(value).trim().replace(/^['"]|['"]$/g, "").trim();
}

function normalize(value = "") {
  return stripQuotes(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function readCategories() {
  if (!fs.existsSync(categoriesPath)) {
    return new Set();
  }

  const source = fs.readFileSync(categoriesPath, "utf8");
  const values = [
    ...source.matchAll(/\btitle:\s*"([^"]+)"/g),
    ...source.matchAll(/\bh1:\s*"([^"]+)"/g)
  ].map((match) => normalize(match[1]));

  return new Set(values);
}

function frontmatterOf(markdown) {
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return match?.[1] ?? "";
}

function bodyOf(markdown) {
  return markdown.replace(/^---\r?\n[\s\S]*?\r?\n---/, "").trim();
}

function scalar(frontmatter, key) {
  const match = frontmatter.match(new RegExp(`^${key}:\\s*(.+)$`, "m"));
  return match ? stripQuotes(match[1]) : "";
}

function hasValidFaq(frontmatter) {
  if (!/^faq:\s*$/m.test(frontmatter)) {
    return false;
  }

  const questionCount = [...frontmatter.matchAll(/^\s*-\s+question:\s*.+$/gm)].length;
  const answerCount = [...frontmatter.matchAll(/^\s+answer:\s*.+$/gm)].length;
  return questionCount > 0 && questionCount === answerCount;
}

function markdownFiles() {
  if (!fs.existsSync(contentDir)) {
    return [];
  }

  return fs.readdirSync(contentDir)
    .filter((file) => file.endsWith(".md"))
    .sort();
}

function hrefTargets(markdown) {
  const markdownLinks = [...markdown.matchAll(/\]\(([^)]+)\)/g)].map((match) => match[1]);
  const htmlLinks = [...markdown.matchAll(/\bhref=["']([^"']+)["']/gi)].map((match) => match[1]);
  return [...markdownLinks, ...htmlLinks]
    .map((href) => href.replace(/[?#].*$/, ""))
    .filter((href) => href && !/^(https?:|mailto:|tel:|#)/i.test(href));
}

function validateDistPage(slug, hasFaq) {
  const distFile = path.join(distArticlesDir, `${slug}.html`);
  if (!fs.existsSync(distFile)) {
    errors.push(`${slug}: URL .html nao foi gerada em dist/articles/. Rode npm run build antes.`);
    return;
  }

  const html = fs.readFileSync(distFile, "utf8");
  const canonical = `${siteUrl}/articles/${slug}.html`;
  if (!html.includes(`href="${canonical}"`)) {
    errors.push(`${slug}: canonical incorreto ou ausente no HTML gerado.`);
  }
  if (!/"@type"\s*:\s*"BlogPosting"/.test(html)) {
    errors.push(`${slug}: BlogPosting ausente no HTML gerado.`);
  }
  if (hasFaq && !/"@type"\s*:\s*"FAQPage"/.test(html)) {
    errors.push(`${slug}: FAQPage ausente apesar de FAQ no Markdown.`);
  }
  if (html.includes("PLACEHOLDER")) {
    errors.push(`${slug}: PLACEHOLDER encontrado no HTML gerado.`);
  }
}

const categories = readCategories();
const files = markdownFiles();
const publishedFiles = files.filter((file) => !file.startsWith("_"));
const templateExists = files.includes("_template.md");

if (!templateExists) {
  errors.push("Template src/content/articles/_template.md nao encontrado.");
}

if (publishedFiles.length === 0) {
  if (errors.length > 0) {
    console.error(errors.join("\n"));
    process.exit(1);
  }
  console.log("Nenhum artigo Markdown publicado encontrado. Template manual existe e sera ignorado no build.");
  process.exit(0);
}

for (const file of publishedFiles) {
  const filePath = path.join(contentDir, file);
  const markdown = fs.readFileSync(filePath, "utf8");
  const frontmatter = frontmatterOf(markdown);
  const body = bodyOf(markdown);
  const slug = scalar(frontmatter, "slug") || file.replace(/\.md$/, "");
  const title = scalar(frontmatter, "title");
  const description = scalar(frontmatter, "description");
  const category = scalar(frontmatter, "category");
  const draft = scalar(frontmatter, "draft");
  const datePublished = scalar(frontmatter, "datePublished");
  const dateModified = scalar(frontmatter, "dateModified");
  const image = scalar(frontmatter, "image");
  const faqValid = hasValidFaq(frontmatter);

  if (!frontmatter) errors.push(`${file}: frontmatter ausente.`);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) errors.push(`${file}: slug invalido (${slug}).`);
  if (file.replace(/\.md$/, "") !== slug) warnings.push(`${file}: nome do arquivo e slug sao diferentes; isso e permitido, mas pode confundir publicacao manual.`);
  if (!title) errors.push(`${file}: title ausente.`);
  if (!description) errors.push(`${file}: description ausente.`);
  if (!category) errors.push(`${file}: category ausente.`);
  if (category && categories.size > 0 && !categories.has(normalize(category))) errors.push(`${file}: categoria invalida (${category}).`);
  if (draft !== "false") errors.push(`${file}: draft precisa ser false para publicar.`);
  if (!datePublished) errors.push(`${file}: datePublished ausente.`);
  if (!dateModified) errors.push(`${file}: dateModified ausente.`);
  if (!image || !/^https:\/\/familiausa1\.com\/assets\//.test(image)) errors.push(`${file}: image deve ser URL absoluta de assets do FamiliaUSA1.`);
  if (/PLACEHOLDER|TODO|example\.com/i.test(markdown)) errors.push(`${file}: texto de placeholder encontrado.`);
  if (!faqValid) errors.push(`${file}: FAQ ausente ou invalido.`);
  if (body.length < 800) warnings.push(`${file}: corpo do artigo parece curto; revise profundidade antes de publicar.`);

  for (const href of hrefTargets(markdown)) {
    if (href.startsWith("/")) {
      const local = path.join(root, href.slice(1));
      const distLocal = path.join(root, "dist", href.slice(1));
      if (!fs.existsSync(local) && !fs.existsSync(distLocal)) {
        warnings.push(`${file}: link interno nao encontrado localmente (${href}).`);
      }
      continue;
    }

    if (href.startsWith("./") || href.endsWith(".html")) {
      const target = href.replace(/^\.\//, "");
      const local = path.join(root, "articles", target);
      const distLocal = path.join(distArticlesDir, target);
      if (!fs.existsSync(local) && !fs.existsSync(distLocal)) {
        warnings.push(`${file}: link relativo para artigo nao encontrado (${href}).`);
      }
    }
  }

  validateDistPage(slug, faqValid);
}

if (errors.length > 0) {
  console.error(errors.join("\n"));
  if (warnings.length > 0) {
    console.warn(`\nAvisos:\n${warnings.join("\n")}`);
  }
  process.exit(1);
}

if (warnings.length > 0) {
  console.warn(`Avisos:\n${warnings.join("\n")}`);
}

console.log(`Artigos Markdown novos validados: ${publishedFiles.length}.`);
