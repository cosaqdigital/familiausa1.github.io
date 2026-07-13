import { allArticles, type SiteArticle } from "./allArticles";
import { SITE_URL } from "./pilotContent";

export type TopicHubStatus = "published" | "planned";

export type TopicHub = {
  slug: string;
  label: string;
  title: string;
  description: string;
  path?: string;
  icon: string;
  status: TopicHubStatus;
  category: string;
  keywords: string[];
  matchCategories: string[];
};

export const hurricaneHub: TopicHub = {
  slug: "furacoes-na-florida",
  label: "Furacões",
  title: "Furacões na Flórida",
  description: "Guia completo sobre temporada de furacões, preparação, evacuação, FEMA, seguros e alertas oficiais para brasileiros.",
  path: "/furacoes-na-florida.html",
  icon: "🌪️",
  status: "published",
  category: "Vida na Flórida",
  keywords: [
    "furacoes-na-florida",
    "vida-na-florida",
    "tempestade-tropical",
    "tropical-storm",
    "tropical-depression",
    "noticias-meteorologicas",
    "nhc",
    "fema",
    "evacuacao",
    "evacuation",
    "clima-extremo",
    "seguro residencial",
    "seguro-residencial"
  ],
  matchCategories: ["Vida na Flórida", "Furacões", "Notícias meteorológicas"]
};

export const topicHubs: TopicHub[] = [
  {
    slug: "empreender-nos-eua",
    label: "Empreender nos EUA",
    title: "Empreender nos EUA",
    description: "Empresa, LLC, EIN, invoice, impostos, clientes e organização de pequenos negócios.",
    path: "/empreendedorismo-nos-estados-unidos.html",
    icon: "🇺🇸",
    status: "published",
    category: "Empreendedorismo",
    keywords: ["empreender", "llc", "ein", "empresa", "invoice"],
    matchCategories: ["Trabalho e renda"]
  },
  {
    slug: "imigracao",
    label: "Imigração",
    title: "Imigração",
    description: "Vistos, green card, asilo, USCIS, documentos e alertas migratórios.",
    path: "/categorias/imigracao-legalizacao.html",
    icon: "🛂",
    status: "published",
    category: "Imigração",
    keywords: ["imigracao", "green card", "visto", "asilo"],
    matchCategories: ["Imigração e legalização"]
  },
  {
    slug: "moradia",
    label: "Moradia",
    title: "Moradia",
    description: "Aluguel, cidades, custo de moradia, crédito e escolha de bairro.",
    path: "/categorias/moradia-nos-eua.html",
    icon: "🏠",
    status: "published",
    category: "Moradia",
    keywords: ["moradia", "aluguel", "cidade", "bairro"],
    matchCategories: ["Moradia nos EUA"]
  },
  {
    slug: "trabalho",
    label: "Trabalho",
    title: "Trabalho nos EUA",
    description: "Emprego, renda, carreira, autorização de trabalho e preparo profissional.",
    path: "/categorias/trabalho-renda.html",
    icon: "💼",
    status: "published",
    category: "Trabalho",
    keywords: ["trabalho", "emprego", "salario", "carreira"],
    matchCategories: ["Trabalho e renda"]
  },
  hurricaneHub,
  {
    slug: "familia",
    label: "Família",
    title: "Família",
    description: "Escola, filhos, rotina familiar, adaptação e rede de apoio.",
    path: "/categorias/familia-filhos.html",
    icon: "👨‍👩‍👧",
    status: "published",
    category: "Família",
    keywords: ["familia", "filhos", "escola"],
    matchCategories: ["Familia e filhos"]
  },
  {
    slug: "saude",
    label: "Saúde",
    title: "Saúde nos EUA",
    description: "Seguro saúde, Marketplace, emergência, urgent care e custos médicos.",
    path: "/categorias/saude-nos-eua.html",
    icon: "🏥",
    status: "published",
    category: "Saúde",
    keywords: ["saude", "seguro saude", "emergencia"],
    matchCategories: ["Saude nos EUA"]
  },
  {
    slug: "financas",
    label: "Finanças",
    title: "Finanças",
    description: "Banco, crédito, ITIN, orçamento, seguros e organização financeira.",
    path: "/categorias/banco-credito.html",
    icon: "💰",
    status: "published",
    category: "Finanças",
    keywords: ["financas", "banco", "credito", "itin"],
    matchCategories: ["Banco e credito"]
  },
  {
    slug: "dirigir-nos-eua",
    label: "Dirigir nos EUA",
    title: "Dirigir nos EUA",
    description: "Carteira, carro, seguro, pedágios, trânsito e custos para brasileiros.",
    icon: "🚗",
    status: "planned",
    category: "Dirigir",
    keywords: ["dirigir", "carro", "seguro auto", "pedagio"],
    matchCategories: []
  },
  {
    slug: "primeira-viagem",
    label: "Primeira viagem",
    title: "Primeira viagem",
    description: "Planejamento, mala, documentos, compras, Orlando e primeiros cuidados.",
    path: "/categorias/orlando-e-viagem.html",
    icon: "✈️",
    status: "published",
    category: "Viagem",
    keywords: ["viagem", "orlando", "primeira viagem"],
    matchCategories: ["Orlando e viagem"]
  }
];

export function topicHubUrl(hub: TopicHub) {
  return hub.path || "#";
}

function normalize(value = "") {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function articleMatchesTopicHub(article: SiteArticle, hub: TopicHub) {
  const tags = Array.isArray((article as SiteArticle & { tags?: string[] }).tags)
    ? (article as SiteArticle & { tags?: string[] }).tags ?? []
    : [];
  const normalizedCategory = normalize(article.category);
  const categoryMatch = hub.matchCategories.some((category) => normalize(category) === normalizedCategory);
  if (categoryMatch) return true;

  const haystack = normalize(`${article.slug} ${article.title} ${article.description} ${article.h1} ${article.category} ${tags.join(" ")}`);
  return hub.keywords.some((keyword) => haystack.includes(normalize(keyword)));
}

export function getArticlesForTopicHub(hub: TopicHub) {
  return allArticles
    .filter((article) => articleMatchesTopicHub(article, hub))
    .sort((left, right) => (right.dateModified || right.datePublished).localeCompare(left.dateModified || left.datePublished));
}

export function topicHubCanonical(hub: TopicHub) {
  return hub.path ? `${SITE_URL}${hub.path}` : "";
}
