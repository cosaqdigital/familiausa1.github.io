import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const catalogPath = path.join(root, "src", "data", "affiliateProducts.ts");
const scanRoots = [
  path.join(root, "src", "components"),
  path.join(root, "src", "content"),
  path.join(root, "src", "layouts"),
  path.join(root, "src", "pages")
];
const errors = [];
const warnings = [];

function readText(filePath) {
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : "";
}

function collectFiles(directory) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) return collectFiles(target);
    return /\.(astro|md|mdx|ts)$/.test(entry.name) ? [target] : [];
  });
}

function relative(filePath) {
  return path.relative(root, filePath).replaceAll("\\", "/");
}

if (!fs.existsSync(catalogPath)) {
  console.error("Affiliate validation failed:\n- src/data/affiliateProducts.ts não encontrado.");
  process.exit(1);
}

const catalogSource = readText(catalogPath);
const catalogMatch = catalogSource.match(/\/\* affiliate-catalog:start \*\/\s*([\s\S]*?)\s*\/\* affiliate-catalog:end \*\//);
if (!catalogMatch) {
  console.error("Affiliate validation failed:\n- Marcadores do catálogo JSON não encontrados.");
  process.exit(1);
}

let products = [];
try {
  products = JSON.parse(catalogMatch[1]);
} catch (error) {
  console.error(`Affiliate validation failed:\n- Catálogo inválido: ${error.message}`);
  process.exit(1);
}

const validMarkets = new Set(["US", "BR"]);
const validRetailers = new Set(["amazon-us", "amazon-br"]);
const ids = new Map();
const urls = new Map();

for (const [index, product] of products.entries()) {
  const label = product?.id || `produto #${index + 1}`;

  if (!product?.id?.trim()) errors.push(`${label}: ID vazio.`);
  if (ids.has(product.id)) errors.push(`${label}: ID duplicado (também em ${ids.get(product.id)}).`);
  else ids.set(product.id, index + 1);

  if (!product?.affiliateUrl?.trim()) errors.push(`${label}: affiliateUrl vazio.`);
  else if (!product.affiliateUrl.startsWith("https://")) errors.push(`${label}: affiliateUrl deve começar com https://.`);

  if (urls.has(product.affiliateUrl)) {
    errors.push(`${label}: affiliateUrl duplicado com ${urls.get(product.affiliateUrl)}.`);
  } else {
    urls.set(product.affiliateUrl, label);
  }

  if (!validMarkets.has(product.market)) errors.push(`${label}: mercado inválido (${product.market}).`);
  if (!validRetailers.has(product.retailer)) errors.push(`${label}: retailer inválido (${product.retailer}).`);
  if (product.market === "US" && product.retailer !== "amazon-us") errors.push(`${label}: mercado US exige amazon-us.`);
  if (product.market === "BR" && product.retailer !== "amazon-br") errors.push(`${label}: mercado BR exige amazon-br.`);
  if (!product?.category?.trim()) errors.push(`${label}: categoria ausente.`);
  if (!Array.isArray(product?.tags) || product.tags.length === 0) errors.push(`${label}: tags ausentes.`);
  if (!Array.isArray(product?.articleTopics) || product.articleTopics.length === 0) warnings.push(`${label}: articleTopics ausentes.`);
}

const knownIds = new Set(products.map((product) => product.id));
const referencePatterns = [
  /\bproductId=["']([^"']+)["']/g,
  /\busProductId=["']([^"']+)["']/g,
  /\bbrProductId=["']([^"']+)["']/g,
  /getAffiliateProductById\(\s*["']([^"']+)["']\s*\)/g
];

let referencesChecked = 0;
for (const filePath of scanRoots.flatMap(collectFiles)) {
  const source = readText(filePath);
  for (const pattern of referencePatterns) {
    for (const match of source.matchAll(pattern)) {
      referencesChecked += 1;
      if (!knownIds.has(match[1])) errors.push(`${relative(filePath)}: referência a ID inexistente (${match[1]}).`);
    }
  }
}

if (products.length !== 11) errors.push(`Catálogo deve conter 11 produtos; encontrados: ${products.length}.`);

if (errors.length) {
  console.error("Affiliate validation failed:");
  for (const error of errors) console.error(`- ${error}`);
  if (warnings.length) for (const warning of warnings) console.warn(`- Aviso: ${warning}`);
  process.exit(1);
}

console.log("Affiliate validation passed.");
console.log(`- Produtos cadastrados: ${products.length}`);
console.log(`- URLs únicas: ${urls.size}`);
console.log(`- Referências verificadas: ${referencesChecked}`);
if (warnings.length) for (const warning of warnings) console.warn(`- Aviso: ${warning}`);
