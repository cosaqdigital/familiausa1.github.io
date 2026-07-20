export type AffiliateMarket = "US" | "BR";
export type AffiliateRetailer = "amazon-us" | "amazon-br";

export interface AffiliateProduct {
  id: string;
  name: string;
  description: string;
  market: AffiliateMarket;
  retailer: AffiliateRetailer;
  affiliateUrl: string;
  category: string;
  tags: string[];
  articleTopics: string[];
  active: boolean;
  featured: boolean;
  disclosureRequired: boolean;
  dateAdded: string;
  lastVerified?: string;
  image?: string;
  notes?: string;
}

export type AffiliateArticleContext =
  | readonly string[]
  | {
      tags?: readonly string[];
      articleTopics?: readonly string[];
      category?: string;
      market?: AffiliateMarket;
    };

// Keep this block JSON-compatible so the dependency-free validator can audit it on Node 20.
export const affiliateProducts: readonly AffiliateProduct[] = /* affiliate-catalog:start */ [
  {
    "id": "power-bank-15000mah-us",
    "name": "Power bank 15.000 mAh com cabo integrado",
    "description": "Bateria portátil com carregamento de 22,5 W, seis saídas e display LED para viagens e emergências.",
    "market": "US",
    "retailer": "amazon-us",
    "affiliateUrl": "https://amzn.to/4psadWn",
    "category": "Energia e carregamento",
    "tags": ["power-bank", "iphone", "viagem", "furacao", "emergencia", "carregador", "celular"],
    "articleTopics": ["iphone", "viagem", "furacoes-na-florida", "kit-de-emergencia"],
    "active": true,
    "featured": true,
    "disclosureRequired": true,
    "dateAdded": "2026-07-20",
    "notes": "Confirmar capacidade, conectores e compatibilidade antes da recomendação editorial."
  },
  {
    "id": "dexnor-iphone-case-us",
    "name": "Capa Dexnor para iPhone 17e e 16e",
    "description": "Capa reforçada compatível com MagSafe, proteção de câmera e suporte integrado.",
    "market": "US",
    "retailer": "amazon-us",
    "affiliateUrl": "https://amzn.to/3RE1LXt",
    "category": "Acessórios para iPhone",
    "tags": ["iphone", "capa", "protecao", "magsafe", "acessorios"],
    "articleTopics": ["iphone", "comprar-iphone-nos-eua", "acessorios-iphone"],
    "active": true,
    "featured": false,
    "disclosureRequired": true,
    "dateAdded": "2026-07-20",
    "notes": "Confirmar o modelo exato do iPhone antes de recomendar."
  },
  {
    "id": "usb-c-charger-kit-us",
    "name": "Kit de carregamento USB-C com cabos longos",
    "description": "Kit com dois cabos USB-C de 10 pés e carregador de múltiplas portas para iPhone e iPad.",
    "market": "US",
    "retailer": "amazon-us",
    "affiliateUrl": "https://amzn.to/4vCvE8p",
    "category": "Energia e carregamento",
    "tags": ["iphone", "usb-c", "carregador", "viagem", "ipad", "cabos"],
    "articleTopics": ["iphone", "comprar-iphone-nos-eua", "viagem", "acessorios-iphone"],
    "active": true,
    "featured": true,
    "disclosureRequired": true,
    "dateAdded": "2026-07-20",
    "notes": "Confirmar potência e padrões de tomada adequados ao uso pretendido."
  },
  {
    "id": "ceptics-travel-adapter-us",
    "name": "Adaptador universal Ceptics 35 W",
    "description": "Adaptador de viagem com tomadas americanas, USB-A e USB-C para diferentes padrões internacionais.",
    "market": "US",
    "retailer": "amazon-us",
    "affiliateUrl": "https://amzn.to/44y9XeN",
    "category": "Viagem",
    "tags": ["adaptador", "tomada", "viagem", "estados-unidos", "brasil", "celular", "notebook"],
    "articleTopics": ["primeira-viagem", "viagem-aos-eua", "eletronicos", "tomadas-nos-eua"],
    "active": true,
    "featured": false,
    "disclosureRequired": true,
    "dateAdded": "2026-07-20",
    "notes": "Adaptador não substitui conversor de voltagem; orientar o leitor a verificar o aparelho."
  },
  {
    "id": "camera-8k-88mp-us",
    "name": "Câmera digital 8K de 88 MP",
    "description": "Câmera com Wi-Fi, foco automático, lente dupla e acessórios voltados a fotografia e vídeo.",
    "market": "US",
    "retailer": "amazon-us",
    "affiliateUrl": "https://amzn.to/4fjql7V",
    "category": "Foto e vídeo",
    "tags": ["camera", "youtube", "fotografia", "vlog", "criador-de-conteudo", "viagem"],
    "articleTopics": ["youtube", "criacao-de-conteudo", "fotografia", "viagem"],
    "active": true,
    "featured": false,
    "disclosureRequired": true,
    "dateAdded": "2026-07-20",
    "notes": "Não comparar com outra câmera apenas pela resolução anunciada."
  },
  {
    "id": "playstation-5-1tb-us",
    "name": "PlayStation 5 com 1 TB",
    "description": "Console PlayStation 5 com armazenamento de 1 TB disponível no mercado americano.",
    "market": "US",
    "retailer": "amazon-us",
    "affiliateUrl": "https://amzn.to/3RzHwdz",
    "category": "Games",
    "tags": ["ps5", "playstation", "console", "games", "comprar-nos-eua"],
    "articleTopics": ["compras-nos-eua", "eletronicos", "games", "playstation"],
    "active": true,
    "featured": false,
    "disclosureRequired": true,
    "dateAdded": "2026-07-20",
    "notes": "Não tratar como equivalente ao modelo digital brasileiro de 825 GB."
  },
  {
    "id": "charger-50w-br",
    "name": "Carregador rápido 50 W com cabo USB-C",
    "description": "Fonte com saídas USB e USB-C acompanhada de cabo para celulares, tablets e outros dispositivos.",
    "market": "BR",
    "retailer": "amazon-br",
    "affiliateUrl": "https://link.amazon/B09yjC8Rx",
    "category": "Energia e carregamento",
    "tags": ["carregador", "usb-c", "celular", "iphone", "tablet", "carga-rapida"],
    "articleTopics": ["iphone", "eletronicos", "acessorios-iphone", "amazon-brasil"],
    "active": true,
    "featured": true,
    "disclosureRequired": true,
    "dateAdded": "2026-07-20",
    "notes": "Confirmar compatibilidade e potência suportada pelo aparelho."
  },
  {
    "id": "power-bank-20000mah-br",
    "name": "Power bank ELG de 20.000 mAh",
    "description": "Bateria portátil com display, USB-C, Micro USB e duas portas USB-A para uso cotidiano e emergências.",
    "market": "BR",
    "retailer": "amazon-br",
    "affiliateUrl": "https://link.amazon/B005jenZW",
    "category": "Energia e carregamento",
    "tags": ["power-bank", "celular", "viagem", "emergencia", "carregador", "iphone"],
    "articleTopics": ["iphone", "viagem", "kit-de-emergencia", "amazon-brasil"],
    "active": true,
    "featured": false,
    "disclosureRequired": true,
    "dateAdded": "2026-07-20",
    "notes": "Confirmar capacidade, conexões e disponibilidade antes da recomendação."
  },
  {
    "id": "playstation-5-digital-br",
    "name": "PlayStation 5 Digital de 825 GB",
    "description": "Console PlayStation 5 em edição digital, com 825 GB e um controle, disponível no mercado brasileiro.",
    "market": "BR",
    "retailer": "amazon-br",
    "affiliateUrl": "https://link.amazon/B0a2xWEbs",
    "category": "Games",
    "tags": ["ps5", "playstation", "console", "games", "amazon-brasil"],
    "articleTopics": ["compras-no-brasil", "eletronicos", "games", "playstation"],
    "active": true,
    "featured": false,
    "disclosureRequired": true,
    "dateAdded": "2026-07-20",
    "notes": "Modelo e armazenamento diferem do produto americano registrado no catálogo."
  },
  {
    "id": "camera-8k-88mp-br",
    "name": "Câmera digital 8K de 88 MP",
    "description": "Câmera com Wi-Fi, foco automático, tela sensível ao toque e recursos para fotografia e vlog.",
    "market": "BR",
    "retailer": "amazon-br",
    "affiliateUrl": "https://link.amazon/B0avTfEiq",
    "category": "Foto e vídeo",
    "tags": ["camera", "youtube", "fotografia", "vlog", "viagem", "criador-de-conteudo"],
    "articleTopics": ["youtube", "criacao-de-conteudo", "fotografia", "viagem", "amazon-brasil"],
    "active": true,
    "featured": false,
    "disclosureRequired": true,
    "dateAdded": "2026-07-20",
    "notes": "Não presumir equivalência com a câmera cadastrada no mercado americano."
  },
  {
    "id": "iphone-16e-128gb-br",
    "name": "Apple iPhone 16e de 128 GB",
    "description": "iPhone 16e preto com 128 GB disponível no mercado brasileiro.",
    "market": "BR",
    "retailer": "amazon-br",
    "affiliateUrl": "https://link.amazon/A08KIjQyA",
    "category": "Celulares",
    "tags": ["iphone", "iphone-16e", "apple", "celular", "amazon-brasil", "comparar-precos"],
    "articleTopics": ["iphone", "comprar-iphone", "iphone-no-brasil", "comparar-precos"],
    "active": true,
    "featured": true,
    "disclosureRequired": true,
    "dateAdded": "2026-07-20",
    "notes": "Confirmar cor, capacidade e vendedor na página da oferta."
  }
] /* affiliate-catalog:end */;

function normalize(value: string) {
  return value.trim().toLocaleLowerCase("pt-BR");
}

function activeUniqueProducts(products: readonly AffiliateProduct[]) {
  const urls = new Set<string>();
  return products.filter((product) => {
    if (!product.active || urls.has(product.affiliateUrl)) return false;
    urls.add(product.affiliateUrl);
    return true;
  });
}

function warnMissingProduct(id: string) {
  if (import.meta.env?.DEV) {
    console.warn(`[affiliate] Produto ativo não encontrado: ${id}`);
  }
}

export function getAffiliateProductById(id: string) {
  const product = affiliateProducts.find((item) => item.id === id && item.active);
  if (!product) warnMissingProduct(id);
  return product;
}

export function getAffiliateProductsByTag(tag: string) {
  const normalizedTag = normalize(tag);
  return activeUniqueProducts(
    affiliateProducts.filter((product) => product.tags.some((item) => normalize(item) === normalizedTag))
  );
}

export function getAffiliateProductsByMarket(market: AffiliateMarket) {
  return activeUniqueProducts(affiliateProducts.filter((product) => product.market === market));
}

export function getAffiliateProductsForArticle(context: AffiliateArticleContext, limit = 5) {
  const requestedTerms = Array.isArray(context)
    ? context
    : [...(context.tags ?? []), ...(context.articleTopics ?? []), context.category ?? ""];
  const terms = new Set(requestedTerms.filter(Boolean).map(normalize));
  const requestedMarket = Array.isArray(context) ? undefined : context.market;

  const scored = affiliateProducts
    .filter((product) => product.active && (!requestedMarket || product.market === requestedMarket))
    .map((product) => {
      const productTerms = [...product.tags, ...product.articleTopics, product.category].map(normalize);
      const score = productTerms.reduce((total, term) => total + (terms.has(term) ? 1 : 0), 0);
      return { product, score };
    })
    .filter((item) => item.score > 0)
    .sort((left, right) => right.score - left.score || Number(right.product.featured) - Number(left.product.featured));

  return activeUniqueProducts(scored.map((item) => item.product)).slice(0, Math.max(0, limit));
}
