import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SITE_URL = "https://familiausa1.com";
const OUTPUT_DIR = path.join(ROOT, "docs", "editorial");
const LEGACY_FILE = path.join(ROOT, "src", "data", "legacy-extract", "legacy-articles.json");
const MARKDOWN_DIR = path.join(ROOT, "src", "content", "articles");

const PR18_SLUGS = new Set([
  "iphone-comprado-nos-eua-funciona-no-brasil",
  "morar-em-boston-2026",
  "cidades-da-florida-com-mais-brasileiros-2026",
  "iphone-nos-eua-vale-a-pena-2026",
  "morar-em-framingham-massachusetts-2026",
  "quanto-custa-morar-em-boca-raton-2026",
  "miami-ou-orlando-onde-morar-2026",
  "quanto-custa-morar-em-orlando-2026",
  "quanto-custa-morar-em-tampa-2026",
  "google-business-profile-prestadores-servico-eua",
  "quanto-custa-morar-em-miami-2026",
  "morar-em-clermont-florida-2026",
  "morar-em-providence-rhode-island-2026",
  "morar-em-manchester-new-hampshire-2026",
  "morar-em-cambridge-massachusetts-2026",
  "como-matricular-filho-na-escola-nos-eua",
  "preciso-de-ssn-para-abrir-llc-nos-eua"
]);

const PR17_SLUGS = new Set([
  "registered-agent-nos-eua-brasileiros",
  "seguro-para-pequenos-negocios-nos-eua",
  "organizar-financas-pequena-empresa-eua",
  "como-conseguir-primeiros-clientes-nos-eua-brasileiro",
  "como-precificar-servicos-nos-estados-unidos"
]);

const GSC_BASELINE = {
  "iphone-comprado-nos-eua-funciona-no-brasil": { clicks: 0, impressions: 616, priority: "maxima", queries: "iphone americano funciona no brasil; iphone comprado nos eua funciona no brasil; iphone americano tem garantia no brasil" },
  "morar-em-boston-2026": { clicks: 5, impressions: 537, priority: "maxima", queries: "boston; morar em boston; custo de vida em boston; boston e bom para morar" },
  "cidades-da-florida-com-mais-brasileiros-2026": { clicks: 8, impressions: 352, priority: "maxima", queries: "qual cidade da florida tem mais brasileiros; cidade da florida com mais brasileiros" },
  "iphone-nos-eua-vale-a-pena-2026": { clicks: 1, impressions: 264, priority: "alta", queries: "quanto e um iphone nos estados unidos 2026" },
  "morar-em-framingham-massachusetts-2026": { clicks: 2, impressions: 208, priority: "alta", queries: "framingham" },
  "quanto-custa-morar-em-boca-raton-2026": { clicks: 1, impressions: 171, priority: "alta", queries: "boca raton; boca raton custo de vida" },
  "miami-ou-orlando-onde-morar-2026": { clicks: 1, impressions: 163, priority: "alta", queries: "morar orlando; miami ou orlando" },
  "quanto-custa-morar-em-orlando-2026": { clicks: 4, impressions: 146, priority: "alta", queries: "custo de vida em orlando; morar orlando" },
  "quanto-custa-morar-em-tampa-2026": { clicks: 4, impressions: 139, priority: "alta", queries: "tampa; morar em tampa" },
  "google-business-profile-prestadores-servico-eua": { clicks: 1, impressions: 130, priority: "alta", queries: "google business profile nos eua; prestador de servico google maps" },
  "quanto-custa-morar-em-miami-2026": { clicks: 1, impressions: 112, priority: "alta", queries: "custo de vida em miami" },
  "morar-em-clermont-florida-2026": { clicks: 3, impressions: 111, priority: "media/alta", queries: "clermont florida" },
  "morar-em-providence-rhode-island-2026": { clicks: 3, impressions: 103, priority: "media/alta", queries: "rhode island; providence" },
  "morar-em-manchester-new-hampshire-2026": { clicks: 0, impressions: 102, priority: "alta", queries: "new hampshire; manchester new hampshire" },
  "morar-em-cambridge-massachusetts-2026": { clicks: 2, impressions: 92, priority: "media/alta", queries: "cambridge massachusetts custo de vida" },
  "quanto-custa-ter-carro-nos-eua-2026": { clicks: 2, impressions: 84, priority: "media", queries: "quanto custa ter carro nos eua" },
  "morar-em-worcester-massachusetts-2026": { clicks: 3, impressions: 82, priority: "media", queries: "worcester massachusetts" },
  "kissimmee-ou-orlando-onde-morar-2026": { clicks: 3, impressions: 80, priority: "media", queries: "kissimmee ou orlando" },
  "como-matricular-filho-na-escola-nos-eua": { clicks: 0, impressions: 73, priority: "alta", queries: "como matricular filho na escola nos eua" },
  "preciso-de-ssn-para-abrir-llc-nos-eua": { clicks: 0, impressions: 41, priority: "alta", queries: "preciso de ssn ou itin para abrir llc nos estados unidos" }
};

const TAXONOMY = [
  { macro: "imigracao", hub: "/categorias/imigracao-legalizacao.html", pillar: "/articles/morar-legalmente-nos-eua-caminhos-possiveis-2026.html", match: ["imigracao", "legalizacao", "legalizar", "uscis", "fronteira", "deportacao", "status", "work-permit", "trabalhar-sem-autorizacao", "turista"] },
  { macro: "green card", hub: "/categorias/imigracao-legalizacao.html", pillar: "/articles/formas-legais-conseguir-green-card-eua-2026.html", match: ["green-card", "adjustment", "consular", "niw"] },
  { macro: "asilo e processos", hub: "/categorias/asilo-nos-eua.html", pillar: "/articles/asilo-nos-estados-unidos-2026.html", match: ["asilo"] },
  { macro: "vistos", hub: "/categorias/visto-americano.html", pillar: "/articles/guia-completo-visto-americano-2026.html", match: ["visto", "ds-160", "agendamento", "entrevista", "renovar", "f1"] },
  { macro: "empreendedorismo", hub: "/empreendedorismo-nos-estados-unidos.html", pillar: "/empreender-nos-estados-unidos-guia-completo.html", match: ["llc", "ein", "itin", "sunbiz", "invoice", "google-business", "registered-agent", "precificar", "primeiros-clientes", "pequenos-negocios", "empresa", "empreendedor", "bookkeeping"] },
  { macro: "trabalho", hub: "/categorias/trabalho-renda.html", pillar: "/articles/como-conseguir-trabalho-nos-eua-sendo-brasileiro-guia-2026.html", match: ["trabalho", "trabalhar", "salario", "renda", "emprego", "carreira", "oficios"] },
  { macro: "cidades", hub: "/categorias/cidades-da-florida.html", pillar: "/articles/cidades-da-florida-com-mais-brasileiros-2026.html", match: ["orlando", "miami", "tampa", "kissimmee", "davenport", "winter-garden", "clermont", "lakeland", "fort-lauderdale", "boca-raton", "deerfield", "pompano", "delray", "west-palm", "sarasota", "naples", "jacksonville", "florida", "boston", "cambridge", "framingham", "worcester", "providence", "manchester", "massachusetts", "rhode-island", "new-hampshire"] },
  { macro: "custo de vida", hub: "/categorias/custo-de-vida.html", pillar: "/articles/custo-de-vida-nos-eua-2026-atualizado.html", match: ["custo", "precos", "quanto-custa", "dinheiro", "salario-minimo", "mercado", "aluguel", "carro"] },
  { macro: "moradia", hub: "/categorias/moradia-nos-eua.html", pillar: "/articles/quanto-custa-alugar-casa-nos-eua-2026.html", match: ["moradia", "alugar", "aluguel", "casa", "credito", "score"] },
  { macro: "compras", hub: "/categorias/compras-nos-eua.html", pillar: "/articles/vale-a-pena-fazer-compras-nos-eua-2026.html", match: ["compras", "iphone", "outlet", "walmart", "target", "black-friday", "amazon", "best-buy", "apple-store"] },
  { macro: "orlando e viagem", hub: "/categorias/orlando-e-viagem.html", pillar: "/articles/guia-completo-orlando-2026-brasileiros.html", match: ["disney", "universal", "parques", "viagem", "orlando", "filas"] },
  { macro: "familia e escola", hub: "/categorias/familia-filhos.html", pillar: "/articles/como-matricular-filho-na-escola-nos-eua.html", match: ["familia", "filhos", "escola", "ano-escolar", "matricular", "crianca"] },
  { macro: "saude", hub: "/categorias/saude-nos-eua.html", pillar: "/articles/seguro-saude-nos-eua-como-funciona-2026.html", match: ["saude", "emergencia", "urgent-care", "er-", "seguro-saude", "cruzeiro", "virus"] },
  { macro: "banco e credito", hub: "/categorias/banco-credito.html", pillar: "/articles/como-abrir-conta-em-banco-nos-eua.html", match: ["banco", "credito", "conta-bancaria", "itin-ssn", "trump-bancos"] },
  { macro: "vida pratica", hub: "/categorias/vida-real-nos-eua.html", pillar: "/articles/a-verdade-sobre-morar-nos-eua.html", match: ["vida-real", "solidao", "verdade", "choque", "adaptacao", "primeiros", "habitos", "brasil-x-eua", "sentimos-falta"] },
  { macro: "noticias e alertas", hub: "/categorias/noticias-eua.html", pillar: "/articles/o-que-pode-mudar-na-imigracao-dos-eua-em-2026.html", match: ["trump", "suprema", "pcc", "china", "lula", "noticia", "copa-2026", "portugal"] }
];

const MACRO_FALLBACK = { macro: "vida pratica", hub: "/categorias/vida-real-nos-eua.html", pillar: "/comece-aqui.html" };

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
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

function stripHtml(html = "") {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;|&#160;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&[a-z0-9#]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function wordCount(text = "") {
  const matches = text.match(/[\p{L}\p{N}]+(?:[-'][\p{L}\p{N}]+)*/gu);
  return matches ? matches.length : 0;
}

function csvEscape(value) {
  const stringValue = value === undefined || value === null ? "" : String(value);
  return `"${stringValue.replace(/"/g, '""')}"`;
}

function writeMarkdownFile(fileName, content) {
  const cleaned = content
    .split(/\r?\n/)
    .map((line) => line.replace(/[ \t]+$/g, ""))
    .join("\n")
    .trimEnd();
  fs.writeFileSync(path.join(OUTPUT_DIR, fileName), `${cleaned}\n`, "utf8");
}

function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  const result = { frontmatter: {}, body: raw };
  if (!match) return result;

  const fm = {};
  const lines = match[1].split(/\r?\n/);
  let currentListKey = null;

  for (const line of lines) {
    const listItem = line.match(/^\s+-\s+"?(.*?)"?\s*$/);
    if (listItem && currentListKey) {
      fm[currentListKey] ||= [];
      fm[currentListKey].push(listItem[1]);
      continue;
    }

    const keyValue = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (!keyValue) continue;

    const [, key, rawValue] = keyValue;
    const value = rawValue.trim();
    if (!value) {
      currentListKey = key;
      fm[key] = [];
      continue;
    }

    currentListKey = null;
    if (value === "true" || value === "false") {
      fm[key] = value === "true";
    } else if (/^\d+$/.test(value)) {
      fm[key] = Number(value);
    } else {
      fm[key] = value.replace(/^["']|["']$/g, "");
    }
  }

  result.frontmatter = fm;
  result.body = raw.slice(match[0].length);
  return result;
}

function extractMarkdownLinks(raw) {
  const links = [];
  for (const match of raw.matchAll(/\]\(([^)]+)\)/g)) links.push(match[1]);
  for (const match of raw.matchAll(/href=["']([^"']+)["']/g)) links.push(match[1]);
  return links;
}

function slugFromHref(href = "") {
  const clean = href.split("#")[0].split("?")[0].replace(/\\/g, "/");
  const file = clean.split("/").pop() || "";
  if (!file.endsWith(".html")) return null;
  return file.replace(/\.html$/, "");
}

function classifyArticle(article) {
  const haystack = normalize(`${article.slug} ${article.title} ${article.description} ${article.category} ${(article.tags || []).join(" ")}`);
  const category = normalize(article.category || "");
  const categoryOverride = [
    { term: "saude", macro: "saude" },
    { term: "banco", macro: "banco e credito" },
    { term: "credito", macro: "banco e credito" },
    { term: "compras", macro: "compras" },
    { term: "familia", macro: "familia e escola" },
    { term: "filhos", macro: "familia e escola" },
    { term: "visto", macro: "vistos" },
    { term: "orlando", macro: "orlando e viagem" },
    { term: "imigracao", macro: "imigracao" }
  ].find((item) => category.includes(item.term));
  const matches = TAXONOMY.filter((tax) => tax.match.some((term) => haystack.includes(normalize(term))));
  const selected = (categoryOverride && TAXONOMY.find((tax) => tax.macro === categoryOverride.macro)) || matches[0] || MACRO_FALLBACK;
  const complements = matches.slice(1, 3).map((item) => item.macro);

  let subcluster = article.category || selected.macro;
  if (selected.macro === "cidades") {
    if (/boston|cambridge|framingham|worcester|providence|manchester|massachusetts|rhode|new-hampshire/.test(haystack)) subcluster = "cidades do Norte e Massachusetts";
    else subcluster = "cidades da Florida";
  }
  if (selected.macro === "compras" && /iphone|apple|best-buy|amazon/.test(haystack)) subcluster = "iPhone e eletronicos";
  if (selected.macro === "empreendedorismo") subcluster = /llc|ein|itin|ssn/.test(haystack) ? "LLC, EIN, SSN e ITIN" : article.category || "pequeno negocio";
  if (selected.macro === "familia e escola") subcluster = /escola|matricular|ano-escolar/.test(haystack) ? "escola e filhos" : "familia";
  if (selected.macro === "saude") subcluster = /cruzeiro/.test(haystack) ? "saude em viagem e cruzeiro" : "saude nos EUA";

  return {
    macrocluster: selected.macro,
    subcluster,
    hubUrl: selected.hub,
    pillarUrl: selected.pillar,
    complementaryClusters: complements.join("; ")
  };
}

function primaryKeyword(article) {
  const h1 = article.h1 || article.title || article.slug;
  return h1
    .replace(/\s*\|\s*FamiliaUSA1/i, "")
    .replace(/\s+em\s+2026\b/i, " 2026")
    .slice(0, 72)
    .trim();
}

function freshnessStatus(article) {
  const modified = article.last_updated || article.publication_date || "";
  if (!modified) return "data nao informada";
  if (modified >= "2026-07-01") return "recente";
  if (modified >= "2026-06-01") return "atual";
  return "revisar freshness";
}

function contentStatus(article) {
  if (PR18_SLUGS.has(article.slug)) return "atualizado";
  if (PR17_SLUGS.has(article.slug)) return "estrategico";
  if (article.word_count < 900 && article.content_type === "article") return "precisa atualizar";
  return "publicado";
}

function detectIntent(article) {
  const text = normalize(`${article.title} ${article.description} ${article.slug}`);
  if (/quanto|custa|preco|salario|dinheiro|vale a pena/.test(text)) return "investigativa/comparativa";
  if (/como|passo|guia|documentos|matricular|abrir/.test(text)) return "informacional/pratica";
  if (/melhor|onde|cidade|morar|comparativo|ou/.test(text)) return "decisao/comparativa";
  if (/noticia|trump|suprema|fim do visto|pcc/.test(text)) return "noticiosa/explicativa";
  return "informacional";
}

function riskPriority(article) {
  if (PR18_SLUGS.has(article.slug)) return "alta - observar GSC";
  if (article.orphan_status === "orfao") return "alta";
  if (article.word_count < 900 && article.content_type === "article") return "media";
  return "baixa";
}

function tokenize(value) {
  return new Set(normalize(value).split(" ").filter((token) => token.length > 3 && !["2026", "para", "como", "guia", "eua", "brasileiros", "familiausa1"].includes(token)));
}

function jaccard(left, right) {
  const a = tokenize(left);
  const b = tokenize(right);
  if (!a.size || !b.size) return 0;
  const intersection = [...a].filter((token) => b.has(token)).length;
  const union = new Set([...a, ...b]).size;
  return intersection / union;
}

function loadLegacyArticles() {
  const legacyData = readJson(LEGACY_FILE);
  return (legacyData.articles || []).map((article) => ({
    source: "legacy",
    content_type: "article",
    file_path: article.originalPath || `articles/${article.slug}.html`,
    url: article.expectedUrl || `${SITE_URL}/articles/${article.slug}.html`,
    slug: article.slug,
    title: article.title || article.h1 || article.slug,
    h1: article.h1 || article.title || article.slug,
    description: article.metaDescription || article.articleContentTextSample || "",
    category: article.category || "Artigos",
    tags: [],
    publication_date: article.datePublished || "",
    last_updated: article.dateModified || article.datePublished || "",
    word_count: article.articleContentWordCount || wordCount(stripHtml(article.articleContentHtml || "")),
    canonical: article.canonical || `${SITE_URL}/articles/${article.slug}.html`,
    links_out_raw: (article.internalLinks || []).map((link) => link.href),
    links_out: (article.internalLinks || []).map((link) => slugFromHref(link.href)).filter(Boolean),
    faq_count: (article.visibleFaqs || []).length
  }));
}

function loadMarkdownArticles() {
  if (!fs.existsSync(MARKDOWN_DIR)) return [];
  return fs
    .readdirSync(MARKDOWN_DIR)
    .filter((file) => file.endsWith(".md") && !file.startsWith("_"))
    .map((file) => {
      const filePath = path.join(MARKDOWN_DIR, file);
      const raw = fs.readFileSync(filePath, "utf8");
      const { frontmatter, body } = parseFrontmatter(raw);
      const slug = frontmatter.slug || file.replace(/\.md$/, "");
      const links = extractMarkdownLinks(raw);
      return {
        source: "markdown",
        content_type: "article",
        file_path: path.relative(ROOT, filePath).replace(/\\/g, "/"),
        url: `${SITE_URL}/articles/${slug}.html`,
        slug,
        title: frontmatter.title || slug,
        h1: frontmatter.h1 || frontmatter.title || slug,
        description: frontmatter.description || "",
        category: frontmatter.category || "Artigos",
        tags: frontmatter.tags || [],
        publication_date: frontmatter.datePublished || "",
        last_updated: frontmatter.dateModified || frontmatter.datePublished || "",
        word_count: wordCount(body),
        canonical: `${SITE_URL}/articles/${slug}.html`,
        links_out_raw: links,
        links_out: links.map(slugFromHref).filter(Boolean),
        faq_count: Array.isArray(frontmatter.faq) ? frontmatter.faq.length : (raw.match(/question:/g) || []).length
      };
    });
}

function parseCategories() {
  const file = path.join(ROOT, "src", "data", "categories.ts");
  const text = fs.readFileSync(file, "utf8");
  const blocks = text.split(/\n\s*\{\s*\n/).slice(1);
  return blocks
    .map((block) => {
      const slug = block.match(/slug:\s*"([^"]+)"/)?.[1];
      if (!slug) return null;
      return {
        slug,
        title: block.match(/title:\s*"([^"]+)"/)?.[1] || slug,
        h1: block.match(/h1:\s*"([^"]+)"/)?.[1] || slug,
        description: block.match(/description:\s*"([^"]+)"/)?.[1] || "",
        canonical: `${SITE_URL}/categorias/${slug}.html`
      };
    })
    .filter(Boolean);
}

function staticPages() {
  return [
    { path: "src/pages/index.astro", url: `${SITE_URL}/`, slug: "home", title: "Home", description: "Porta de entrada do Familia USA1", type: "hub" },
    { path: "src/pages/blog.astro", url: `${SITE_URL}/blog.html`, slug: "blog", title: "Blog", description: "Indice geral de artigos", type: "hub" },
    { path: "src/pages/categorias.astro", url: `${SITE_URL}/categorias.html`, slug: "categorias", title: "Categorias", description: "Indice de hubs por categoria", type: "hub" },
    { path: "src/pages/comece-aqui.astro", url: `${SITE_URL}/comece-aqui.html`, slug: "comece-aqui", title: "Comece Aqui", description: "Hub de navegacao para novos leitores", type: "hub" },
    { path: "src/pages/checklist-mudanca-eua.astro", url: `${SITE_URL}/checklist-mudanca-eua.html`, slug: "checklist-mudanca-eua", title: "Checklist de mudanca", description: "Lead magnet gratuito", type: "tool" },
    { path: "src/pages/empreendedorismo-nos-estados-unidos.astro", url: `${SITE_URL}/empreendedorismo-nos-estados-unidos.html`, slug: "empreendedorismo-nos-estados-unidos", title: "Hub de empreendedorismo", description: "Hub do cluster de empreendedorismo", type: "hub" },
    { path: "src/pages/empreender-nos-estados-unidos-guia-completo.astro", url: `${SITE_URL}/empreender-nos-estados-unidos-guia-completo.html`, slug: "empreender-nos-estados-unidos-guia-completo", title: "Pilar de empreendedorismo", description: "Pilar do cluster de empreendedorismo", type: "pillar" },
    { path: "src/pages/sobre.astro", url: `${SITE_URL}/sobre.html`, slug: "sobre", title: "Sobre", description: "Pagina institucional", type: "institutional" },
    { path: "src/pages/contato.astro", url: `${SITE_URL}/contato.html`, slug: "contato", title: "Contato", description: "Pagina de contato", type: "institutional" },
    { path: "src/pages/politica-de-privacidade.astro", url: `${SITE_URL}/politica-de-privacidade.html`, slug: "politica-de-privacidade", title: "Politica de Privacidade", description: "Pagina legal", type: "legal" },
    { path: "src/pages/politica-de-cookies.astro", url: `${SITE_URL}/politica-de-cookies.html`, slug: "politica-de-cookies", title: "Politica de Cookies", description: "Pagina legal", type: "legal" },
    { path: "src/pages/termos-de-uso.astro", url: `${SITE_URL}/termos-de-uso.html`, slug: "termos-de-uso", title: "Termos de Uso", description: "Pagina legal", type: "legal" }
  ];
}

function sourceReferenceCounts(slugs) {
  const folders = ["src/pages", "src/components", "src/data"];
  const files = [];
  const walk = (dir) => {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (full.includes("legacy-extract")) continue;
        walk(full);
      } else if (/\.(astro|ts|js|mjs|md)$/.test(entry.name)) {
        files.push(full);
      }
    }
  };
  folders.forEach((folder) => walk(path.join(ROOT, folder)));
  const counts = Object.fromEntries(slugs.map((slug) => [slug, 0]));
  for (const file of files) {
    const text = fs.readFileSync(file, "utf8");
    for (const slug of slugs) {
      const re = new RegExp(`${slug}(?:\\.html)?`, "g");
      const matches = text.match(re);
      if (matches) counts[slug] += matches.length;
    }
  }
  return counts;
}

function buildInventory() {
  const articles = [...loadLegacyArticles(), ...loadMarkdownArticles()];
  const articleSlugSet = new Set(articles.map((article) => article.slug));
  const sourceRefs = sourceReferenceCounts([...articleSlugSet]);
  const incoming = Object.fromEntries(articles.map((article) => [article.slug, 0]));

  for (const article of articles) {
    article.links_out = [...new Set(article.links_out.filter((slug) => articleSlugSet.has(slug) && slug !== article.slug))];
    for (const target of article.links_out) incoming[target] = (incoming[target] || 0) + 1;
  }

  const normTitleMap = new Map();
  const normDescriptionMap = new Map();
  for (const article of articles) {
    const titleKey = normalize(article.title);
    const descKey = normalize(article.description);
    normTitleMap.set(titleKey, [...(normTitleMap.get(titleKey) || []), article.slug]);
    if (descKey) normDescriptionMap.set(descKey, [...(normDescriptionMap.get(descKey) || []), article.slug]);
  }

  const similarPairs = [];
  for (let i = 0; i < articles.length; i += 1) {
    for (let j = i + 1; j < articles.length; j += 1) {
      const left = articles[i];
      const right = articles[j];
      const score = jaccard(`${left.title} ${left.slug}`, `${right.title} ${right.slug}`);
      if (score >= 0.42) similarPairs.push({ left: left.slug, right: right.slug, score });
    }
  }

  const cannibalBySlug = new Map();
  for (const pair of similarPairs) {
    cannibalBySlug.set(pair.left, [...(cannibalBySlug.get(pair.left) || []), pair.right]);
    cannibalBySlug.set(pair.right, [...(cannibalBySlug.get(pair.right) || []), pair.left]);
  }

  const enrichedArticles = articles.map((article, index) => {
    const classification = classifyArticle(article);
    const titleDuplicates = normTitleMap.get(normalize(article.title)) || [];
    const descriptionDuplicates = normDescriptionMap.get(normalize(article.description)) || [];
    const internalLinksIn = (incoming[article.slug] || 0) + (sourceRefs[article.slug] || 0);
    const orphan = internalLinksIn === 0 ? "orfao" : "recebe links";
    const duplicateRisk = titleDuplicates.length > 1 || descriptionDuplicates.length > 1 ? "possivel duplicacao" : "baixo";
    const cannibalTargets = cannibalBySlug.get(article.slug) || [];
    const cannibalizationRisk = cannibalTargets.length ? `possivel sobreposicao: ${cannibalTargets.slice(0, 4).join("; ")}` : "baixo";
    const gsc = GSC_BASELINE[article.slug];
    const base = {
      id: `ART-${String(index + 1).padStart(4, "0")}`,
      ...article,
      ...classification,
      internal_links_out: article.links_out.length,
      internal_links_in: internalLinksIn,
      orphan_status: orphan,
      status: contentStatus(article),
      intent: detectIntent(article),
      primary_keyword: primaryKeyword(article),
      secondary_keywords: [...new Set([...(article.tags || []), ...(gsc?.queries?.split("; ") || [])])].slice(0, 8).join("; "),
      search_console_status: gsc ? `${gsc.clicks} clicks / ${gsc.impressions} impressoes; prioridade ${gsc.priority}` : "nao informado",
      optimization_status: PR18_SLUGS.has(article.slug) ? "otimizado PR #18; observar 28 dias" : PR17_SLUGS.has(article.slug) ? "publicado no cluster PR #17" : "sem acao recente registrada",
      freshness_status: freshnessStatus(article),
      duplicate_risk: duplicateRisk,
      cannibalization_risk: cannibalizationRisk,
      action_required: PR18_SLUGS.has(article.slug) ? "monitorar Search Console antes de nova alteracao" : duplicateRisk !== "baixo" || cannibalTargets.length ? "avaliar diferenciacao editorial" : article.word_count < 900 ? "expandir ou atualizar" : "manter e fortalecer links internos",
      priority: riskPriority({ ...article, orphan_status: orphan }),
      notes: classification.complementaryClusters ? `clusters complementares: ${classification.complementaryClusters}` : ""
    };
    return base;
  });

  const categories = parseCategories().map((category, index) => ({
    id: `HUB-${String(index + 1).padStart(3, "0")}`,
    file_path: `src/pages/categorias/[slug].astro:${category.slug}`,
    url: category.canonical,
    slug: category.slug,
    title: category.title,
    meta_description: category.description,
    content_type: "hub",
    macrocluster: classifyArticle({ slug: category.slug, title: category.title, description: category.description, category: category.title, tags: [] }).macrocluster,
    subcluster: category.title,
    category: "Hub",
    tags: "",
    publication_date: "",
    last_updated: "",
    word_count: "",
    hub_url: category.canonical,
    pillar_url: "",
    internal_links_out: "",
    internal_links_in: "",
    orphan_status: "hub",
    canonical: category.canonical,
    status: "publicado",
    intent: "navegacao/hub",
    primary_keyword: category.h1,
    secondary_keywords: "",
    search_console_status: "nao informado",
    optimization_status: "hub dinamico",
    freshness_status: "revisar trimestralmente",
    duplicate_risk: "baixo",
    cannibalization_risk: "baixo",
    action_required: "manter atualizado conforme novos artigos",
    priority: "media",
    notes: ""
  }));

  const pages = staticPages().map((page, index) => ({
    id: `PAGE-${String(index + 1).padStart(3, "0")}`,
    file_path: page.path,
    url: page.url,
    slug: page.slug,
    title: page.title,
    meta_description: page.description,
    content_type: page.type,
    macrocluster: page.slug.includes("empreendedor") ? "empreendedorismo" : "institucional",
    subcluster: page.type,
    category: page.type,
    tags: "",
    publication_date: "",
    last_updated: "",
    word_count: "",
    hub_url: page.type === "hub" ? page.url : "",
    pillar_url: page.type === "pillar" ? page.url : "",
    internal_links_out: "",
    internal_links_in: "",
    orphan_status: page.type,
    canonical: page.url,
    status: "publicado",
    intent: page.type === "legal" ? "confianca/conformidade" : "navegacao",
    primary_keyword: page.title,
    secondary_keywords: "",
    search_console_status: "nao informado",
    optimization_status: "estrutura do portal",
    freshness_status: "revisar semestralmente",
    duplicate_risk: "baixo",
    cannibalization_risk: "baixo",
    action_required: "manter",
    priority: page.type === "hub" ? "alta" : "baixa",
    notes: ""
  }));

  return { articles: enrichedArticles, categories, pages, similarPairs };
}

function writeCsv(rows) {
  const columns = [
    "id",
    "file_path",
    "url",
    "slug",
    "title",
    "meta_description",
    "content_type",
    "macrocluster",
    "subcluster",
    "category",
    "tags",
    "publication_date",
    "last_updated",
    "word_count",
    "hub_url",
    "pillar_url",
    "internal_links_out",
    "internal_links_in",
    "orphan_status",
    "canonical",
    "status",
    "intent",
    "primary_keyword",
    "secondary_keywords",
    "search_console_status",
    "optimization_status",
    "freshness_status",
    "duplicate_risk",
    "cannibalization_risk",
    "action_required",
    "priority",
    "notes"
  ];
  const lines = [columns.map(csvEscape).join(",")];
  for (const row of rows) {
    lines.push(columns.map((column) => csvEscape(row[column])).join(","));
  }
  fs.writeFileSync(path.join(OUTPUT_DIR, "CONTENT_INVENTORY.csv"), lines.join("\n") + "\n", "utf8");
}

function clusterStats(articles) {
  const map = new Map();
  for (const article of articles) {
    if (!map.has(article.macrocluster)) {
      map.set(article.macrocluster, {
        macrocluster: article.macrocluster,
        count: 0,
        subclusters: new Set(),
        hubs: new Set(),
        pillars: new Set(),
        orphans: 0,
        lowWordCount: 0,
        pr18: 0,
        examples: []
      });
    }
    const item = map.get(article.macrocluster);
    item.count += 1;
    item.subclusters.add(article.subcluster);
    if (article.hubUrl) item.hubs.add(article.hubUrl);
    if (article.pillarUrl) item.pillars.add(article.pillarUrl);
    if (article.orphan_status === "orfao") item.orphans += 1;
    if (article.word_count < 900) item.lowWordCount += 1;
    if (PR18_SLUGS.has(article.slug)) item.pr18 += 1;
    if (item.examples.length < 8) item.examples.push(article.slug);
  }
  return [...map.values()].sort((a, b) => b.count - a.count);
}

function coverageLevel(stat) {
  if (stat.count >= 25 && stat.hubs.size && stat.pillars.size) return "100% completo/forte";
  if (stat.count >= 15 && stat.hubs.size && stat.pillars.size) return "75% forte";
  if (stat.count >= 6 && stat.hubs.size) return "50% parcial";
  if (stat.count > 0) return "25% inicial";
  return "0% inexistente";
}

function mdTable(headers, rows) {
  const line = `| ${headers.join(" | ")} |`;
  const sep = `| ${headers.map(() => "---").join(" | ")} |`;
  const body = rows.map((row) => `| ${row.map((cell) => String(cell ?? "").replace(/\n/g, " ")).join(" | ")} |`);
  return [line, sep, ...body].join("\n");
}

function dashboard(summary) {
  return mdTable(
    ["Metrica", "Valor"],
    [
      ["Artigos totais", summary.articleCount],
      ["Artigos legados", summary.legacyCount],
      ["Artigos Markdown", summary.markdownCount],
      ["Paginas de categoria/hub", summary.categoryCount],
      ["Paginas principais/institucionais", summary.pageCount],
      ["Total inventariado", summary.inventoryCount],
      ["Clusters oficiais", summary.clusterCount],
      ["Possiveis duplicacoes", summary.duplicateCount],
      ["Possiveis canibalizacoes", summary.cannibalCount],
      ["Artigos orfaos por grafo editorial", summary.orphanCount]
    ]
  );
}

function buildSummary(articles, categories, pages, similarPairs) {
  const duplicateKeys = new Map();
  for (const article of articles) {
    const key = normalize(article.title);
    duplicateKeys.set(key, [...(duplicateKeys.get(key) || []), article.slug]);
  }
  const duplicateCount = [...duplicateKeys.values()].filter((items) => items.length > 1).length;
  return {
    articleCount: articles.length,
    legacyCount: articles.filter((article) => article.source === "legacy").length,
    markdownCount: articles.filter((article) => article.source === "markdown").length,
    categoryCount: categories.length,
    pageCount: pages.length,
    inventoryCount: articles.length + categories.length + pages.length,
    clusterCount: clusterStats(articles).length,
    duplicateCount,
    cannibalCount: similarPairs.length,
    orphanCount: articles.filter((article) => article.orphan_status === "orfao").length
  };
}

function writeMasterPlan(summary, stats) {
  const strong = stats.filter((stat) => coverageLevel(stat).startsWith("75") || coverageLevel(stat).startsWith("100"));
  const weak = stats.filter((stat) => coverageLevel(stat).startsWith("25") || coverageLevel(stat).startsWith("50"));
  const content = `# Editorial Master Plan - Familia USA1

Atualizado em: 2026-07-11
Fonte: inventario gerado a partir do repositorio Astro em \`src/content/articles\`, \`src/data/legacy-extract/legacy-articles.json\`, \`src/pages\` e \`src/data\`.

## 1. Missao editorial

Transformar o Familia USA1 em uma referencia em portugues para brasileiros que vivem, estao chegando ou planejam viver, viajar, estudar, empreender ou recomeçar nos Estados Unidos.

O portal deve combinar experiencia real, responsabilidade editorial, fontes oficiais e linguagem simples. O conteudo nao deve vender ilusao, prometer regularizacao, incentivar ilegalidade, substituir advogado, contador, medico ou profissional habilitado.

## 2. Publico-alvo

- Brasileiros no Brasil pesquisando EUA, visto, Orlando, compras, cidades, trabalho e custo de vida.
- Brasileiros recem-chegados aos EUA.
- Familias brasileiras com filhos em fase de adaptacao.
- Imigrantes que precisam entender limites legais, documentos, bancos, escola, saude e trabalho.
- Prestadores de servico e pequenos empreendedores brasileiros nos EUA.

## 3. Posicionamento

O Familia USA1 deve ser percebido como um portal de vida real: pratico, humano, responsavel e atualizado. O diferencial nao e apenas explicar o que fazer, mas mostrar o que pesa na rotina de uma familia brasileira nos Estados Unidos.

## 4. Painel do inventario

${dashboard(summary)}

## 5. Macroclusters oficiais

${mdTable(["Macrocluster", "Artigos", "Cobertura", "Hub principal", "Pilar principal"], stats.map((stat) => [stat.macrocluster, stat.count, coverageLevel(stat), [...stat.hubs][0] || "pendente", [...stat.pillars][0] || "pendente"]))}

## 6. Paginas HUB existentes

- \`/blog.html\`: indice geral.
- \`/categorias.html\`: indice de categorias.
- \`/comece-aqui.html\`: hub de navegacao por momento do leitor.
- 20 hubs dinamicos em \`/categorias/*.html\`.
- \`/empreendedorismo-nos-estados-unidos.html\`: hub dedicado de empreendedorismo.

## 7. Paginas Pilar existentes

- \`/articles/custo-de-vida-nos-eua-2026-atualizado.html\`
- \`/articles/guia-completo-visto-americano-2026.html\`
- \`/articles/asilo-nos-estados-unidos-2026.html\`
- \`/articles/formas-legais-conseguir-green-card-eua-2026.html\`
- \`/articles/morar-legalmente-nos-eua-caminhos-possiveis-2026.html\`
- \`/articles/cidades-da-florida-com-mais-brasileiros-2026.html\`
- \`/categorias/cidades-do-norte-e-massachusetts.html\` como hub regional, com artigos satelite.
- \`/empreender-nos-estados-unidos-guia-completo.html\`
- \`/articles/guia-completo-orlando-2026-brasileiros.html\`
- \`/articles/vale-a-pena-fazer-compras-nos-eua-2026.html\`

## 8. Hubs faltantes recomendados

- Hub de tecnologia e eletronicos: iPhone, eSIM, garantia, Amazon, Best Buy, Apple Store e alfandega.
- Hub de documentos nos EUA: SSN, ITIN, EIN, carteira, passaporte, escola, banco e comprovantes.
- Hub de impostos e vida fiscal: imposto pessoal, 1099, W-9, sales tax, bookkeeping e CPA.
- Hub de filhos e escola por estado/cidade.
- Hub de saude para familias: seguro, urgent care, ER, farmacia, viagem e rotina.

## 9. Pilares faltantes recomendados

- Guia completo de documentos para brasileiros nos EUA.
- Guia completo de impostos para brasileiros nos EUA.
- Guia completo de tecnologia/compras: iPhone, eSIM, garantia e eletronicos.
- Guia completo de escola publica nos EUA para familias brasileiras.
- Guia completo de seguro saude nos EUA para familias brasileiras.

## 10. Prioridades dos proximos 90 dias

1. Consolidar clusters com impressao no Search Console sem mexer novamente nas paginas da PR #18 durante a janela de observacao.
2. Criar hubs/pilares faltantes onde ja existem varios artigos soltos.
3. Completar empreendedorismo com sales tax, contratos/estimate, conta empresarial e impostos.
4. Fortalecer familia/escola e saude com conteudo evergreen.
5. Integrar uma pauta semanal com YouTube ou short para melhorar E-E-A-T.

## 11. Criterios de publicacao

- Todo artigo novo deve ter macrocluster, subcluster, hub e pilar definidos antes de ser escrito.
- O tema deve ser conferido no \`CONTENT_INVENTORY.csv\` e no \`CLUSTER_MAP.md\`.
- O artigo deve ter intencao de busca clara: informacional, comparativa, transacional, local, noticia ou experiencia.
- Artigos sensiveis exigem fontes oficiais e aviso de limite editorial.

## 12. Criterios de atualizacao

- Atualizar paginas com impressoes e CTR baixo quando houver dados do Search Console.
- Atualizar temas com datas, regras, valores, visto, saude, imposto, banco ou imigracao sempre que a informacao ficar instavel.
- Registrar toda atualizacao em \`OPTIMIZATION_HISTORY.md\`.

## 13. Criterios de consolidacao

Nao apagar artigos. Quando houver sobreposicao:

- Definir pagina principal.
- Ajustar title/H1/meta para diferenciar intencao.
- Inserir links internos apontando satelite para pilar.
- So considerar redirect depois de justificativa documentada.

## 14. Criterios de canibalizacao

Risco existe quando dois artigos disputam a mesma consulta com mesma promessa. Exemplo: artigo de iPhone compatibilidade deve ser diferente do artigo de preco/vale a pena. Artigo de cidade deve ser diferente de comparativo entre cidades.

## 15. Criterios de qualidade

- Introducao responde a pergunta principal em ate 3 paragrafos.
- Conteudo usa tabelas quando ha comparacao, custo ou checklist.
- FAQ so deve existir se houver perguntas reais.
- Links internos contextuais sao preferidos a blocos soltos.
- O tom deve ser humano, responsavel e sem promessas.

## 16. Criterios de links internos

- Todo artigo deve apontar para 1 hub, 1 pilar, 2 artigos irmaos e 1 cluster complementar quando fizer sentido.
- Hubs devem apontar para todos os artigos importantes do cluster.
- Artigos novos nao podem nascer orfaos.

## 17. Criterios de fontes

- Imigracao: USCIS, State Department, ICE, CBP, Federal Register, cortes ou fontes jornalisticas confiaveis para noticia.
- Impostos/empresa: IRS, SBA, FinCEN, estado, cidade/condado e CPA quando aplicavel.
- Saude: fontes oficiais, seguradoras, CDC, HHS ou hospitais/sistemas oficiais.
- Valores: sempre usar faixas e data de referencia.

## 18. Temas sensiveis

Imigracao, asilo, trabalho sem autorizacao, impostos, saude, banco e seguranca nao podem ser tratados como receita individual. Usar linguagem educativa e recomendar profissional qualificado.

## 19. Fluxo antes de criar novo artigo

1. Consultar \`CONTENT_INVENTORY.csv\`.
2. Consultar \`CLUSTER_MAP.md\`.
3. Verificar se existe artigo igual, parecido ou pilar que deveria receber atualizacao.
4. Definir macrocluster, subcluster, hub, pilar e links internos.
5. Checar Search Console se houver dados.
6. Escrever outline e somente depois produzir.
7. Validar build e registrar no inventario.

## 20. Fluxo antes de atualizar artigo

1. Identificar motivo: GSC, erro factual, regra nova, valor desatualizado ou canibalizacao.
2. Registrar pagina em observacao se veio de Search Console.
3. Preservar URL e canonical.
4. Alterar title/meta/H1 apenas se houver ganho claro.
5. Rodar validacoes.
6. Registrar em \`OPTIMIZATION_HISTORY.md\`.

## 21. Clusters fortes

${strong.map((stat) => `- ${stat.macrocluster}: ${stat.count} artigos, cobertura ${coverageLevel(stat)}.`).join("\n")}

## 22. Clusters que precisam reforco

${weak.map((stat) => `- ${stat.macrocluster}: ${stat.count} artigos, cobertura ${coverageLevel(stat)}.`).join("\n")}
`;
  writeMarkdownFile("EDITORIAL_MASTER_PLAN.md", content);
}

function writeClusterMap(stats, articles) {
  const sections = stats.map((stat) => {
    const items = articles.filter((article) => article.macrocluster === stat.macrocluster);
    const missing = missingArticlesForCluster(stat.macrocluster).map((item) => `  - ${item}`).join("\n") || "  - Nenhum item critico definido nesta rodada.";
    const overlap = items.filter((article) => article.cannibalization_risk !== "baixo").slice(0, 8);
    return `## ${stat.macrocluster}

- Objetivo: cobrir a jornada do leitor dentro de ${stat.macrocluster}, com hub, pilar, satelites e atualizacoes orientadas por Search Console.
- Hub: ${[...stat.hubs][0] || "pendente"}
- Pilar: ${[...stat.pillars][0] || "pendente"}
- Artigos existentes: ${stat.count}
- Cobertura atual: ${coverageLevel(stat)}
- Nivel de autoridade: ${coverageLevel(stat).includes("100") || coverageLevel(stat).includes("75") ? "forte" : coverageLevel(stat).includes("50") ? "parcial" : "inicial"}
- Links internos faltantes: revisar artigos com menos de 3 links recebidos e adicionar links contextuais a partir de hubs e pilares.
- Paginas orfas: ${stat.orphans}
- Riscos de sobreposicao: ${overlap.length ? overlap.map((article) => article.slug).join("; ") : "baixo no inventario automatico"}

### Artigos existentes

${items.map((article) => `- [${article.title}](${article.url}) - ${article.slug}`).join("\n")}

### Artigos ou ativos faltantes

${missing}

### Proximos passos

- Atualizar hub se o cluster receber novo artigo.
- Garantir que cada novo artigo aponte para o pilar e para 2 satelites.
- Monitorar impressoes e CTR antes de reotimizar paginas alteradas recentemente.
`;
  });

  const content = `# Cluster Map - Familia USA1

Atualizado em: 2026-07-11

Escala de cobertura:

- 0% inexistente
- 25% inicial
- 50% parcial
- 75% forte
- 100% completo/forte

${mdTable(["Cluster", "Artigos", "Cobertura", "Orfaos", "PR #18 em observacao"], stats.map((stat) => [stat.macrocluster, stat.count, coverageLevel(stat), stat.orphans, stat.pr18]))}

${sections.join("\n")}
`;
  writeMarkdownFile("CLUSTER_MAP.md", content);
}

function missingArticlesForCluster(cluster) {
  const gaps = {
    "empreendedorismo": ["Sales tax para pequenos negocios nos EUA", "Contrato e estimate para prestadores de servico", "Conta bancaria empresarial nos EUA", "Quando contratar CPA nos EUA"],
    "familia e escola": ["Calendario escolar por estado", "Como conversar com escola sem falar ingles bem", "ESL e adaptacao de filhos brasileiros"],
    "saude": ["Marketplace de seguro saude para imigrantes", "Quanto custa consulta medica nos EUA", "Farmacia, receita e remedios nos EUA"],
    "compras": ["Hub iPhone e eletronicos nos EUA", "Alfandega brasileira para eletronicos", "Garantia internacional: Apple, Amazon e Best Buy"],
    "banco e credito": ["Conta empresarial nos EUA", "Como construir credito com ITIN", "Cartao secured para brasileiros"],
    "trabalho": ["Oficios com maior demanda por estado", "Como montar portfolio de servicos", "Quanto cobrar por servicos de entrada"],
    "custo de vida": ["Custo de vida por estado", "Comparativo Florida x Texas x Massachusetts", "Quanto guardar antes de mudar com filhos"],
    "imigracao": ["Guia de documentos por status", "Como evitar golpe de consultor migratorio", "Checklist antes de sair dos EUA para processo consular"]
  };
  return gaps[cluster] || ["Revisar oportunidades com Search Console e relatorio externo pendente."];
}

function writeContentGaps(stats, articles) {
  const articleSlugs = new Set(articles.map((article) => article.slug));
  const statusFor = (slug) => articleSlugs.has(slug) ? "publicado em 2026-07-11" : "pendente";
  const gaps = [
    [statusFor("hub-compras-iphone"), "prioridade maxima", "Hub tecnologia/iPhone", "compras", "comparativa/transacional", "hub novo", "/categorias/compras-nos-eua.html", "/articles/iphone-nos-eua-vale-a-pena-2026.html", "medio", "alto", "medio", "alto", "alto", "iPhone ja recebe impressoes e tem mais de um artigo satelite."],
    [statusFor("sales-tax-pequenos-negocios-eua"), "prioridade maxima", "Sales tax para pequenos negocios", "empreendedorismo", "informacional/pratica", "artigo novo", "/empreendedorismo-nos-estados-unidos.html", "/empreender-nos-estados-unidos-guia-completo.html", "baixo", "medio", "baixo", "baixo", "alto", "Cluster de empreendedorismo ja tem LLC/EIN/invoice/Google; artigo publicado para fechar lacuna fiscal inicial."],
    [statusFor("contrato-estimate-prestadores-servico-eua"), "alta", "Contrato e estimate para prestadores", "empreendedorismo", "pratica/transacional", "artigo novo", "/empreendedorismo-nos-estados-unidos.html", "/empreender-nos-estados-unidos-guia-completo.html", "baixo", "medio", "medio", "baixo", "alto", "Complementa invoice, precificacao e primeiros clientes."],
    [statusFor("conta-bancaria-empresarial-eua"), "alta", "Conta bancaria empresarial nos EUA", "banco e credito", "informacional/pratica", "artigo novo", "/categorias/banco-credito.html", "/articles/como-abrir-conta-em-banco-nos-eua.html", "medio", "medio", "baixo", "baixo", "alto", "Conecta banco, ITIN, SSN, LLC e empreendedorismo; artigo publicado como ponte entre clusters."],
    [statusFor("guia-escola-publica-eua-brasileiros"), "alta", "Guia completo de escola publica nos EUA", "familia e escola", "informacional", "pilar novo ou atualizacao", "/categorias/familia-filhos.html", "/articles/como-matricular-filho-na-escola-nos-eua.html", "medio", "alto", "medio", "medio", "medio", "Artigo de matricula ja recebe impressoes; guia publicado para ampliar autoridade sem editar pagina em observacao."],
    [statusFor("seguro-saude-familias-brasileiras-eua"), "alta", "Seguro saude para familias brasileiras", "saude", "informacional/comparativa", "pilar novo ou atualizacao", "/categorias/saude-nos-eua.html", "/articles/seguro-saude-nos-eua-como-funciona-2026.html", "baixo", "alto", "baixo", "baixo", "alto", "Saude e cluster sensivel, com monetizacao futura e alto valor de usuario; artigo familiar publicado."],
    [statusFor("custo-de-vida-florida-texas-massachusetts"), "media", "Custo de vida por estado", "custo de vida", "comparativa", "artigo novo", "/categorias/custo-de-vida.html", "/articles/custo-de-vida-nos-eua-2026-atualizado.html", "medio", "alto", "medio", "baixo", "medio", "Custo de vida pilar existe, falta comparativo por estado."],
    [statusFor("construir-credito-com-itin-nos-eua"), "media", "Como construir credito com ITIN", "banco e credito", "pratica", "artigo novo", "/categorias/banco-credito.html", "/articles/como-funciona-o-credito-nos-eua.html", "medio", "medio", "baixo", "baixo", "alto", "Conecta ITIN, banco, cartao secured e vida financeira."],
    [statusFor("oficios-com-demanda-na-florida"), "media", "Oficios por cidade/estado", "trabalho", "informacional/comparativa", "serie nova", "/categorias/trabalho-renda.html", "/articles/trabalhos-aprender-antes-de-vir-eua-vistos-carreira.html", "medio", "medio", "alto", "medio", "medio", "Boa ponte entre YouTube, vida real e SEO long tail."],
    ["pendente", "baixa", "Relatorio externo de 90 dias", "planejamento editorial", "auditoria", "importar/avaliar", "docs/editorial", "docs/editorial", "nao informado", "nao informado", "nao informado", "nao informado", "nao informado", "Arquivo especifico do plano de 90 dias nao foi localizado neste ambiente; importar quando disponivel."]
  ];
  const content = `# Content Gaps - Familia USA1

Atualizado em: 2026-07-11

Este documento compara o acervo real do repositorio com oportunidades editoriais. O relatorio externo de 90 dias citado no briefing nao foi localizado no caminho informado; um anexo antigo encontrado era de outro projeto e foi descartado.

## Lacunas priorizadas

${mdTable(["Status", "Prioridade", "Tema", "Cluster", "Intencao", "Formato", "Hub relacionado", "Pilar relacionado", "Risco de canibalizacao", "Potencial Search", "Potencial Discover", "Potencial YouTube", "Potencial monetizacao", "Justificativa"], gaps)}

## Clusters fracos ou incompletos pelo inventario

${stats.filter((stat) => coverageLevel(stat).startsWith("25") || coverageLevel(stat).startsWith("50")).map((stat) => `- ${stat.macrocluster}: ${stat.count} artigos, cobertura ${coverageLevel(stat)}. Proximo passo: ${missingArticlesForCluster(stat.macrocluster)[0]}.`).join("\n")}

## Observacao sobre PR #18

As paginas otimizadas na PR #18 devem ficar em observacao por pelo menos 28 dias antes de nova alteracao editorial, salvo erro factual, problema tecnico ou mudanca urgente.
`;
  writeMarkdownFile("CONTENT_GAPS.md", content);
}

function writeRoadmap(articles) {
  const articleSlugs = new Set(articles.map((article) => article.slug));
  const markPublished = (row) => {
    const slug = row[4];
    const shouldMark = articleSlugs.has(slug) && ["artigo novo", "pilar"].includes(row[2]);
    return shouldMark ? [...row.slice(0, 15), "publicado em 2026-07-11"] : row;
  };
  const rows = [
    ["1", "2026-07-15", "atualizacao", "Atualizar hub de compras para cluster iPhone", "hub-compras-iphone", "compras", "/categorias/compras-nos-eua.html", "/articles/iphone-nos-eua-vale-a-pena-2026.html", "iphone nos EUA", "comparativa", "alta", "iPhone ja recebe impressoes", "iPhone pilar, compatibilidade, Apple/Best Buy", "medio", "observar PR #18", "planejado"],
    ["1", "2026-07-17", "artigo novo", "Alfandega para eletronicos comprados nos EUA", "alfandega-eletronicos-eua-brasil", "compras", "/categorias/compras-nos-eua.html", "/articles/vale-a-pena-fazer-compras-nos-eua-2026.html", "alfandega eletronicos EUA", "informacional", "alta", "Complementa iPhone sem duplicar compatibilidade", "iPhone, compras, Receita Federal", "baixo", "fontes oficiais", "planejado"],
    ["1", "2026-07-19", "YouTube integrado", "Short: iPhone dos EUA funciona no Brasil?", "short-iphone-eua-brasil", "compras", "/categorias/compras-nos-eua.html", "/articles/iphone-comprado-nos-eua-funciona-no-brasil.html", "iphone americano funciona", "video suporte", "alta", "Apoiar CTR e autoridade", "artigo PR #18", "baixo", "sem editar artigo", "planejado"],
    ["2", "2026-07-22", "artigo novo", "Sales tax para pequenos negocios nos EUA", "sales-tax-pequenos-negocios-eua", "empreendedorismo", "/empreendedorismo-nos-estados-unidos.html", "/empreender-nos-estados-unidos-guia-completo.html", "sales tax nos EUA", "informacional/pratica", "alta", "Lacuna clara no cluster", "LLC, invoice, bookkeeping", "baixo", "fontes estado/IRS/SBA", "planejado"],
    ["2", "2026-07-24", "artigo novo", "Contrato e estimate para prestadores de servico", "contrato-estimate-prestadores-servico-eua", "empreendedorismo", "/empreendedorismo-nos-estados-unidos.html", "/empreender-nos-estados-unidos-guia-completo.html", "estimate prestador EUA", "pratica", "alta", "Complementa invoice e precificacao", "invoice, precificacao, clientes", "baixo", "modelo educativo sem aconselhamento juridico", "planejado"],
    ["2", "2026-07-26", "atualizacao", "Fortalecer hub de empreendedorismo", "empreendedorismo-nos-estados-unidos", "empreendedorismo", "/empreendedorismo-nos-estados-unidos.html", "/empreender-nos-estados-unidos-guia-completo.html", "empreender nos EUA", "hub", "alta", "Receber novos artigos", "todos do cluster", "baixo", "apos publicar artigos", "planejado"],
    ["3", "2026-07-29", "artigo novo", "Conta bancaria empresarial nos EUA", "conta-bancaria-empresarial-eua", "banco e credito", "/categorias/banco-credito.html", "/articles/como-abrir-conta-em-banco-nos-eua.html", "business bank account EUA", "informacional/pratica", "alta", "Conecta banco e LLC", "LLC, EIN, ITIN", "medio", "cuidado com compliance/KYC", "planejado"],
    ["3", "2026-07-31", "artigo novo", "Como construir credito com ITIN", "construir-credito-com-itin-nos-eua", "banco e credito", "/categorias/banco-credito.html", "/articles/como-funciona-o-credito-nos-eua.html", "credito com ITIN", "pratica", "media", "Cluster banco/credito precisa aprofundar", "ITIN, conta bancaria", "medio", "fontes de bancos/CFPB se possivel", "planejado"],
    ["4", "2026-08-05", "pilar", "Guia completo de escola publica nos EUA", "guia-escola-publica-eua-brasileiros", "familia e escola", "/categorias/familia-filhos.html", "/articles/como-matricular-filho-na-escola-nos-eua.html", "escola publica nos EUA", "informacional", "alta", "Artigo de matricula ja recebe impressoes", "matricula, ano escolar, filhos", "medio", "nao reotimizar PR #18 sem necessidade", "planejado"],
    ["4", "2026-08-07", "YouTube integrado", "Como matricular filho na escola nos EUA", "video-matricula-escola-eua", "familia e escola", "/categorias/familia-filhos.html", "/articles/como-matricular-filho-na-escola-nos-eua.html", "matricular filho escola EUA", "video suporte", "alta", "Apoiar artigo em observacao", "artigo escola", "baixo", "sem editar artigo", "planejado"],
    ["5", "2026-08-12", "artigo novo", "ESL e adaptacao de filhos brasileiros", "esl-adaptacao-filhos-brasileiros-eua", "familia e escola", "/categorias/familia-filhos.html", "/articles/como-matricular-filho-na-escola-nos-eua.html", "ESL nos EUA", "informacional", "media", "Subcluster familia precisa crescer", "ano escolar, matricula", "baixo", "fontes escolares oficiais", "planejado"],
    ["5", "2026-08-14", "atualizacao", "Atualizar categoria familia e filhos", "familia-filhos", "familia e escola", "/categorias/familia-filhos.html", "/articles/como-matricular-filho-na-escola-nos-eua.html", "familia e filhos EUA", "hub", "media", "Receber novos satelites", "matricula, ano escolar", "baixo", "apos novo artigo", "planejado"],
    ["6", "2026-08-19", "pilar", "Guia de seguro saude para familias brasileiras", "seguro-saude-familias-brasileiras-eua", "saude", "/categorias/saude-nos-eua.html", "/articles/seguro-saude-nos-eua-como-funciona-2026.html", "seguro saude EUA familia", "informacional", "alta", "Tema sensivel e monetizavel", "ER, urgent care, doente viagem", "medio", "fontes oficiais e disclaimers", "planejado"],
    ["6", "2026-08-21", "artigo novo", "Quanto custa consulta medica nos EUA", "quanto-custa-consulta-medica-nos-eua", "saude", "/categorias/saude-nos-eua.html", "/articles/seguro-saude-nos-eua-como-funciona-2026.html", "consulta medica EUA custo", "informacional", "media", "Complementa saude e custo de vida", "ER, urgent care", "baixo", "usar faixas e fonte", "planejado"],
    ["7", "2026-08-26", "artigo novo", "Custo de vida Florida x Texas x Massachusetts", "custo-de-vida-florida-texas-massachusetts", "custo de vida", "/categorias/custo-de-vida.html", "/articles/custo-de-vida-nos-eua-2026-atualizado.html", "custo de vida Florida Texas Massachusetts", "comparativa", "alta", "Une clusters fortes", "Florida, Boston, custo EUA", "medio", "nao competir com pilar geral", "planejado"],
    ["7", "2026-08-28", "atualizacao", "Fortalecer links do pilar custo de vida", "custo-de-vida-nos-eua-2026-atualizado", "custo de vida", "/categorias/custo-de-vida.html", "/articles/custo-de-vida-nos-eua-2026-atualizado.html", "custo de vida nos EUA", "pilar", "media", "Receber comparativo", "cidade/carro/salario", "baixo", "atualizacao leve", "planejado"],
    ["8", "2026-09-02", "artigo novo", "Documentos importantes para brasileiros nos EUA", "documentos-importantes-brasileiros-nos-eua", "documentos", "/comece-aqui.html", "/articles/documentos-para-imigrar-para-os-eua.html", "documentos nos EUA", "informacional", "alta", "Falta hub documental dedicado", "SSN, ITIN, escola, banco", "medio", "fontes oficiais", "planejado"],
    ["8", "2026-09-04", "hub", "Criar hub de documentos nos EUA", "documentos-nos-eua", "documentos", "/documentos-nos-eua.html", "/articles/documentos-importantes-brasileiros-nos-eua.html", "documentos para brasileiros nos EUA", "hub", "alta", "Organizar cluster transversal", "imigracao, banco, escola", "baixo", "nova pagina hub", "planejado"],
    ["9", "2026-09-09", "artigo novo", "Como evitar golpe de consultor migratorio", "golpe-consultor-migratorio-eua", "imigracao", "/categorias/imigracao-legalizacao.html", "/articles/7-sinais-de-golpe-na-imigracao-dos-eua.html", "golpe imigracao EUA", "alerta", "alta", "Tema de seguranca e E-E-A-T", "advogado confiavel, golpes", "baixo", "fontes oficiais/FTC/USCIS", "planejado"],
    ["9", "2026-09-11", "YouTube integrado", "3 sinais de golpe migratorio", "short-golpe-migratorio", "imigracao", "/categorias/imigracao-legalizacao.html", "/articles/7-sinais-de-golpe-na-imigracao-dos-eua.html", "golpe imigracao", "video suporte", "media", "Apoiar alerta evergreen", "golpes", "baixo", "roteiro curto", "planejado"],
    ["10", "2026-09-16", "artigo novo", "Oficios com demanda na Florida", "oficios-com-demanda-na-florida", "trabalho", "/categorias/trabalho-renda.html", "/articles/trabalhos-aprender-antes-de-vir-eua-vistos-carreira.html", "oficios na Florida", "informacional/comparativa", "media", "Conecta trabalho e cidades", "Orlando, Tampa, Miami", "medio", "sem promessa de visto", "planejado"],
    ["10", "2026-09-18", "artigo novo", "Como montar portfolio de servicos nos EUA", "portfolio-prestador-servico-eua", "trabalho", "/categorias/trabalho-renda.html", "/articles/google-business-profile-prestadores-servico-eua.html", "portfolio prestador EUA", "pratica", "media", "Ajuda prestadores e Google Business", "primeiros clientes, GBP", "baixo", "pode render YouTube", "planejado"],
    ["11", "2026-09-23", "artigo novo", "Marketplace de seguro saude nos EUA", "marketplace-seguro-saude-eua-brasileiros", "saude", "/categorias/saude-nos-eua.html", "/articles/seguro-saude-nos-eua-como-funciona-2026.html", "marketplace seguro saude EUA", "informacional", "media", "Complementa seguro saude", "familias, custo", "baixo", "fontes Healthcare.gov", "planejado"],
    ["11", "2026-09-25", "atualizacao", "Atualizar hub de saude", "saude-nos-eua", "saude", "/categorias/saude-nos-eua.html", "/articles/seguro-saude-nos-eua-como-funciona-2026.html", "saude nos EUA", "hub", "media", "Receber novos artigos", "ER, urgent care, seguro", "baixo", "apos publicar artigos", "planejado"],
    ["12", "2026-09-30", "auditoria", "Revisar resultados da PR #18 no GSC", "auditoria-pr18-gsc", "SEO", "docs/editorial/SEARCH_CONSOLE_TRACKING.md", "docs/editorial/OPTIMIZATION_HISTORY.md", "CTR artigos otimizados", "analise", "maxima", "Janela de 28 dias ja passou", "17 paginas PR #18", "baixo", "usar dados reais do GSC", "planejado"],
    ["12", "2026-10-02", "planejamento", "Atualizar inventario e roadmap", "atualizar-editorial-system", "SEO editorial", "docs/editorial", "docs/editorial/EDITORIAL_MASTER_PLAN.md", "inventario editorial", "governanca", "alta", "Manter sistema vivo", "todos os clusters", "baixo", "rodar script editorial", "planejado"]
  ];
  const roadmapRows = rows.map(markPublished);
  const content = `# Publishing Roadmap 90 Days - Familia USA1

Atualizado em: 2026-07-11

Cadencia recomendada: 2 a 3 novos artigos por semana no inicio, 1 atualizacao por semana, 1 hub/pilar por mes e 1 peca integrada com YouTube por semana. Nao forcar 90 artigos. Qualidade e arquitetura valem mais que volume bruto.

Regra importante: paginas otimizadas na PR #18 ficam em observacao ate a proxima coleta relevante do Search Console. Nao mexer nelas novamente sem motivo factual ou tecnico.

${mdTable(["Semana", "Data sugerida", "Acao", "Titulo provisiorio", "Slug provisiorio", "Cluster", "Hub", "Pilar", "Palavra-chave", "Intencao", "Prioridade", "Justificativa", "Links planejados", "Risco canibalizacao", "Dependencias", "Status"], roadmapRows)}
`;
  writeMarkdownFile("PUBLISHING_ROADMAP_90_DAYS.md", content);
}

function writeOptimizationHistory(articles) {
  const pr18Rows = [...PR18_SLUGS].map((slug) => {
    const article = articles.find((item) => item.slug === slug);
    const gsc = GSC_BASELINE[slug];
    return [
      "2026-07-10",
      "PR #18",
      slug,
      gsc ? `${gsc.clicks} clicks / ${gsc.impressions} impressoes` : "dados nao informados",
      "title, H1, meta description, resumo rapido e links contextuais quando aplicavel",
      "observar 28 dias",
      article?.url || `${SITE_URL}/articles/${slug}.html`
    ];
  });
  const rows = [
    ["2026-07-11", "codex/proximos-5-artigos-editoriais", "5 artigos estrategicos", "Rodada baseada no Sistema Editorial Mestre", "Novos artigos Markdown em compras, empreendedorismo, banco, familia/escola e saude", "monitorar indexacao e primeiras impressoes", "/blog.html"],
    ["2026-07-09", "PR #17", "cluster empreendedorismo", "Novo cluster publicado", "5 novos artigos e atualizacao de hub/pilar", "validar indexacao e links internos", "/empreendedorismo-nos-estados-unidos.html"],
    ["2026-07-08", "PR #16 / commit 8833e07", "AdSense", "Preparacao/verificacao", "script de verificacao AdSense preservado globalmente", "acompanhar revisao AdSense", "/politica-de-privacidade.html"],
    ...pr18Rows
  ];
  const content = `# Optimization History - Familia USA1

Atualizado em: 2026-07-11

Este arquivo registra publicacoes e otimizacoes relevantes para impedir retrabalho, duplicacao e alteracoes prematuras em paginas em observacao.

${mdTable(["Data", "Referencia", "Pagina/cluster", "Motivo", "Tipo de ajuste", "Janela/acao futura", "URL"], rows)}

## Metricas futuras a comparar

- CTR antes/depois.
- Posicao media.
- Impressoes por consulta principal.
- Cliques por URL.
- Consultas novas surgidas depois da otimizacao.
- Se o Google reescreveu title ou snippet.

## Regras de observacao

- Nao reotimizar pagina da PR #18 antes de 28 dias, salvo erro tecnico/factual.
- Registrar novas mudancas neste arquivo no mesmo PR.
- Toda mudanca motivada por Search Console deve informar data_range usado.
`;
  writeMarkdownFile("OPTIMIZATION_HISTORY.md", content);
}

function writeSearchConsoleTracking(articles) {
  const rows = Object.entries(GSC_BASELINE).map(([slug, data]) => {
    const article = articles.find((item) => item.slug === slug);
    const ctr = data.impressions ? `${((data.clicks / data.impressions) * 100).toFixed(2)}%` : "nao informado";
    return [
      "dados recentes informados no briefing",
      article?.url || `${SITE_URL}/articles/${slug}.html`,
      data.clicks,
      data.impressions,
      ctr,
      "nao informado",
      data.queries,
      PR18_SLUGS.has(slug) ? "otimizado na PR #18" : "monitorar",
      PR18_SLUGS.has(slug) ? "2026-07-10" : "nao informado",
      PR18_SLUGS.has(slug) ? "2026-08-07" : "proxima coleta GSC",
      "pendente",
      PR18_SLUGS.has(slug) ? "aguardar dados" : "avaliar se entra em proximo lote"
    ];
  });
  const content = `# Search Console Tracking - Familia USA1

Atualizado em: 2026-07-11

Use este arquivo para registrar dados exportados do Google Search Console. Nao inventar posicao media ou CTR se o dado nao estiver disponivel.

${mdTable(["date_range", "url", "clicks", "impressions", "ctr", "average_position", "top_queries", "action_taken", "date_of_action", "expected_review_date", "result", "next_action"], rows)}
`;
  writeMarkdownFile("SEARCH_CONSOLE_TRACKING.md", content);
}

function writeEditorialRules() {
  const content = `# Editorial Rules - Familia USA1

Atualizado em: 2026-07-11

Estas regras sao obrigatorias para qualquer trabalho futuro do Codex, editor ou desenvolvedor no portal.

## Antes de criar artigo novo

1. Pesquisar todo o repositorio.
2. Consultar \`docs/editorial/CONTENT_INVENTORY.csv\`.
3. Consultar \`docs/editorial/CONTENT_GAPS.md\`.
4. Consultar \`docs/editorial/CLUSTER_MAP.md\`.
5. Consultar \`docs/editorial/PUBLISHING_ROADMAP_90_DAYS.md\`.
6. Verificar slug, titulo, intencao e cluster.
7. Verificar canibalizacao.
8. Verificar se o tema deveria ser atualizacao de artigo existente.
9. Definir macrocluster, subcluster, hub e pilar.
10. Nao criar artigo sem hub ou pilar relacionado.
11. Nao publicar artigo orfao.
12. Nao criar conteudo duplicado.

## Antes de atualizar artigo existente

1. Verificar se a pagina esta em observacao no \`OPTIMIZATION_HISTORY.md\`.
2. Nao alterar pagina em observacao sem erro factual, tecnico ou nova evidencia forte.
3. Preservar URL e canonical.
4. Nao alterar title/meta/H1 sem motivo claro.
5. Registrar toda otimizacao no historico.

## Regras tecnicas

1. Preservar URLs existentes.
2. Nao alterar AdSense sem tarefa especifica.
3. Nao alterar \`global.css\` parcialmente.
4. Rodar build e validacoes antes de publicar.
5. Atualizar docs editoriais depois de cada lote.
6. Registrar toda publicacao no inventario.
7. Validar sitemap e canonicals.

## Fontes oficiais obrigatorias

- Imigracao, visto, asilo, green card: USCIS, State Department, CBP, ICE, Federal Register ou fonte oficial equivalente.
- Impostos, empresa, banco: IRS, SBA, FinCEN, estado, cidade/condado, banco ou fonte oficial.
- Saude: CDC, HHS, Healthcare.gov, hospitais/sistemas oficiais ou fontes medicas reconhecidas.
- Valores: usar faixas, mes/ano e linguagem de estimativa.

## Linguagem

- Sem promessa de aprovacao migratoria.
- Sem incentivo a trabalho irregular.
- Sem aconselhamento juridico, fiscal, medico ou financeiro individual.
- Sem clickbait em tema sensivel.
- Sem texto generico que poderia estar em qualquer blog.

## Links internos

Cada artigo deve ter, quando fizer sentido:

- 1 link para hub.
- 1 link para pilar.
- 2 links para artigos irmaos.
- 1 link para cluster complementar.

## Checklist de fechamento

- Build passou.
- Validacoes passaram.
- URL preservada.
- Canonical correto.
- BlogPosting/FAQPage quando aplicavel.
- Sitemap atualizado pelo fluxo Astro.
- Inventario e historico atualizados.
`;
  writeMarkdownFile("EDITORIAL_RULES.md", content);
}

function writeReadme(summary) {
  const content = `# Sistema Editorial - Familia USA1

Este diretorio e a fonte oficial de organizacao editorial do portal.

## Arquivos

- \`EDITORIAL_MASTER_PLAN.md\`: documento mestre de estrategia.
- \`CONTENT_INVENTORY.csv\`: inventario completo de artigos, hubs, pilares e paginas.
- \`CONTENT_GAPS.md\`: lacunas priorizadas.
- \`CLUSTER_MAP.md\`: mapa de clusters e cobertura.
- \`PUBLISHING_ROADMAP_90_DAYS.md\`: cronograma editorial recomendado.
- \`OPTIMIZATION_HISTORY.md\`: historico de otimizacoes e publicacoes relevantes.
- \`EDITORIAL_RULES.md\`: regras obrigatorias para futuras tarefas.
- \`SEARCH_CONSOLE_TRACKING.md\`: estrutura de acompanhamento de GSC.

## Como regenerar

\`\`\`bash
node scripts/editorial/generate-editorial-system.mjs
\`\`\`

## Estado atual

${dashboard(summary)}
`;
  writeMarkdownFile("README.md", content);
}

function writeAll() {
  ensureDir(OUTPUT_DIR);
  const { articles, categories, pages, similarPairs } = buildInventory();
  const rows = [
    ...articles.map((article) => ({
      ...article,
      meta_description: article.description,
      tags: (article.tags || []).join("; "),
      hub_url: article.hubUrl,
      pillar_url: article.pillarUrl
    })),
    ...categories,
    ...pages
  ];
  const stats = clusterStats(articles);
  const summary = buildSummary(articles, categories, pages, similarPairs);

  writeCsv(rows);
  writeMasterPlan(summary, stats);
  writeContentGaps(stats, articles);
  writeClusterMap(stats, articles);
  writeRoadmap(articles);
  writeOptimizationHistory(articles);
  writeSearchConsoleTracking(articles);
  writeEditorialRules();
  writeReadme(summary);

  console.log(`Sistema editorial gerado em ${path.relative(ROOT, OUTPUT_DIR)}`);
  console.log(JSON.stringify(summary, null, 2));
}

writeAll();
