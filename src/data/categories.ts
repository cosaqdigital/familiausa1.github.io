import { SITE_URL } from "./pilotContent";
import { allArticles, type SiteArticle } from "./allArticles";

export type SiteCategory = {
  slug: string;
  title: string;
  h1: string;
  description: string;
  intro: string;
  canonical: string;
  matchCategories: string[];
  matchKeywords: string[];
  hubLinks?: string[];
};

function normalize(value = "") {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&ccedil;|ç/g, "c")
    .replace(/&atilde;|ã/g, "a")
    .replace(/&eacute;|é/g, "e")
    .replace(/&iacute;|í/g, "i")
    .replace(/&oacute;|ó/g, "o")
    .replace(/&uacute;|ú/g, "u")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export const siteCategories: SiteCategory[] = [
  {
    slug: "adaptacao-cultural",
    title: "Adaptacao cultural",
    h1: "Adaptacao cultural",
    description: "Costumes, escola, redes sociais, filhos, leis estranhas, comportamento publico e diferencas culturais.",
    intro: "Entenda diferencas culturais que brasileiros precisam respeitar nos Estados Unidos, da escola ao comportamento publico.",
    canonical: `${SITE_URL}/categorias/adaptacao-cultural.html`,
    matchCategories: ["Adaptacao cultural", "Adaptação cultural", "Choque cultural", "Erros para evitar", "Seguranca nos EUA", "Segurança nos EUA"],
    matchKeywords: ["costumes", "choque", "leis-estranhas", "brasil-x-eua", "coisas-comuns", "problemas-eua"]
  },
  {
    slug: "asilo-nos-eua",
    title: "Asilo nos EUA",
    h1: "Asilo nos EUA em 2026: guia central para brasileiros",
    description: "Pagina pilar sobre asilo nos EUA para brasileiros: quem pode pedir, documentos, provas, riscos, negativas e cuidados antes de protocolar.",
    intro: "Asilo e um tema serio. Use este hub para estudar requisitos, documentos, riscos e alternativas sem tratar o processo como atalho migratorio.",
    canonical: `${SITE_URL}/categorias/asilo-nos-eua.html`,
    matchCategories: ["Asilo Estados Unidos"],
    matchKeywords: ["asilo"]
  },
  {
    slug: "banco-credito",
    title: "Banco e credito",
    h1: "Banco e credito",
    description: "Conta bancaria, ITIN, SSN, score, credito, cartoes, bancos e vida financeira para brasileiros.",
    intro: "Guias para entender conta bancaria, ITIN, SSN, credito e cuidados financeiros nos Estados Unidos.",
    canonical: `${SITE_URL}/categorias/banco-credito.html`,
    matchCategories: ["Banco e credito", "Banco e crédito", "Banco nos EUA", "Credito nos EUA", "Crédito nos EUA"],
    matchKeywords: ["banco", "credito", "credit", "itin", "ssn", "conta-bancaria"]
  },
  {
    slug: "cidades-da-florida",
    title: "Cidades da Florida",
    h1: "Onde morar na Florida em 2026: guia completo para brasileiros",
    description: "Guia completo para brasileiros escolherem onde morar na Florida em 2026: Orlando, Miami, Tampa, Jacksonville, Fort Lauderdale, Boca Raton, Deerfield Beach, Pompano Beach, custo, trabalho e escolas.",
    intro: "Compare cidades da Florida por custo, trabalho, escola, carro, comunidade brasileira, praia e qualidade de vida.",
    canonical: `${SITE_URL}/categorias/cidades-da-florida.html`,
    matchCategories: ["Cidades da Florida", "Cidades da Flórida", "Cidades perto de Orlando", "Comparativo de cidades", "South Florida", "South Florida brasileira", "Sudoeste da Florida", "Sudoeste da Flórida", "Tampa Bay", "Palm Beach County", "Guia pilar"],
    matchKeywords: ["orlando", "miami", "tampa", "kissimmee", "davenport", "winter-garden", "clermont", "lakeland", "fort-lauderdale", "boca-raton", "deerfield", "pompano", "delray", "west-palm", "sarasota", "naples", "cape-coral", "fort-myers", "florida"]
  },
  {
    slug: "vida-na-florida",
    title: "Vida na Flórida",
    h1: "Vida na Flórida para brasileiros",
    description: "Guias sobre rotina, clima, furacões, preparação, seguros, família, cidades e cuidados práticos para brasileiros que vivem ou querem morar na Flórida.",
    intro: "Conteúdos para brasileiros entenderem a vida real na Flórida: clima extremo, furacões, preparação, seguros, cidades, família e rotina.",
    canonical: `${SITE_URL}/categorias/vida-na-florida.html`,
    matchCategories: ["Vida na Florida", "Vida na Flórida", "Furacoes", "Furacões", "Noticias meteorologicas", "Notícias meteorológicas"],
    matchKeywords: ["furacoes-na-florida", "vida-na-florida", "hurricane", "tropical-storm", "tempestade-tropical", "fema", "evacuacao", "evacuation", "seguro-residencial", "clima-extremo"],
    hubLinks: ["/furacoes-na-florida.html"]
  },
  {
    slug: "cidades-do-norte-e-massachusetts",
    title: "Cidades do Norte e Massachusetts",
    h1: "Cidades do Norte dos EUA para brasileiros em 2026: Boston, Massachusetts e alternativas mais acessiveis",
    description: "Guia pilar para brasileiros sobre cidades do Norte dos EUA e Massachusetts em 2026: Boston, Cambridge, Worcester, Framingham, Providence, Manchester, New Haven, Hartford e cidades mais baratas.",
    intro: "Compare Boston, Massachusetts, Rhode Island e New Hampshire por aluguel, trabalho, estudo, inverno e comunidade brasileira.",
    canonical: `${SITE_URL}/categorias/cidades-do-norte-e-massachusetts.html`,
    matchCategories: ["Cidades do Norte e Massachusetts", "Massachusetts", "New Hampshire", "Rhode Island"],
    matchKeywords: ["boston", "cambridge", "worcester", "framingham", "providence", "manchester", "massachusetts"]
  },
  {
    slug: "compras-nos-eua",
    title: "Compras nos EUA",
    h1: "Compras nos EUA em 2026: guia para brasileiros",
    description: "Guia pilar de compras nos EUA para brasileiros: outlets, Walmart, Target, iPhone, impostos, dolar, alfandega e o que realmente vale a pena.",
    intro: "Planeje compras nos EUA com foco em preco real, imposto, garantia, bagagem, alfandega e custo-beneficio.",
    canonical: `${SITE_URL}/categorias/compras-nos-eua.html`,
    matchCategories: ["Compras nos EUA", "Orlando e compras"],
    matchKeywords: ["compras", "outlet", "outlets", "walmart", "target", "iphone", "black-friday"]
  },
  {
    slug: "custo-de-vida",
    title: "Custo de vida",
    h1: "Custo de vida nos EUA em 2026: guia para brasileiros",
    description: "Guia pilar de custo de vida nos EUA para brasileiros: aluguel, mercado, carro, seguro saude, contas, Florida, salario e planejamento familiar.",
    intro: "Veja custos de aluguel, mercado, carro, saude, contas, salario e reserva antes de tomar decisoes grandes.",
    canonical: `${SITE_URL}/categorias/custo-de-vida.html`,
    matchCategories: ["Custo de vida", "Custo de vida nos EUA", "Planejamento financeiro"],
    matchKeywords: ["custo", "precos", "quanto-custa", "salario", "mercado", "aluguel", "carro", "dinheiro"]
  },
  {
    slug: "familia-filhos",
    title: "Familia e filhos",
    h1: "Familia e filhos",
    description: "Escola publica, matricula, ano escolar, adaptacao das criancas, rotina familiar e rede de apoio.",
    intro: "Conteudos para familias brasileiras com filhos: escola, matricula, adaptacao, rotina e cuidados no recomeeco.",
    canonical: `${SITE_URL}/categorias/familia-filhos.html`,
    matchCategories: ["Familia e filhos", "Família e filhos"],
    matchKeywords: ["filho", "filhos", "escola", "ano-escolar", "matricular", "familia"]
  },
  {
    slug: "imigracao-e-bancos",
    title: "Imigracao e bancos",
    h1: "Imigracao e bancos nos EUA",
    description: "Conta bancaria, ITIN, status migratorio, credito e alertas financeiros que podem impactar imigrantes nos Estados Unidos.",
    intro: "Acompanhe alertas sobre bancos, ITIN, status migratorio, credito e regras financeiras que podem afetar imigrantes.",
    canonical: `${SITE_URL}/categorias/imigracao-e-bancos.html`,
    matchCategories: ["Imigracao e bancos", "Imigração e bancos"],
    matchKeywords: ["trump-bancos", "itin", "conta-banco", "conta-bancaria"]
  },
  {
    slug: "imigracao-legalizacao",
    title: "Imigracao e legalizacao",
    h1: "Imigracao e legalizacao nos EUA em 2026: vistos, green card, asilo e trabalho",
    description: "Hub completo de imigracao e legalizacao nos EUA para brasileiros: vistos, green card, asilo, F1, trabalho autorizado, riscos, documentos, golpes e quando procurar advogado.",
    intro: "Guias responsaveis sobre caminhos legais, green card, vistos, asilo, riscos, golpes e trabalho autorizado nos EUA.",
    canonical: `${SITE_URL}/categorias/imigracao-legalizacao.html`,
    matchCategories: ["Imigracao e legalizacao", "Imigração e legalização", "Imigracao e planejamento", "Imigração EUA", "Imigracao nos EUA", "Imigração nos EUA", "Imigracao para brasileiros", "Imigração para brasileiros", "Imigracao consciente", "Imigração consciente", "Fronteira e imigracao", "Fronteira e imigração", "Imigracao e fronteira", "Imigração e fronteira", "Fraude imigracao", "Fraude imigração", "Fraude migratoria EUA", "Fraude migratória EUA", "Noticias de imigracao", "Notícias de imigração"],
    matchKeywords: ["imigracao", "legalizacao", "green-card", "visto-temporario", "adjustment", "consular", "uscis", "fronteira", "deportacao", "work-permit", "asilo"]
  },
  {
    slug: "moradia-nos-eua",
    title: "Moradia nos EUA",
    h1: "Moradia nos EUA",
    description: "Aluguel, deposito, credito, score, escolha de cidade, contrato e cuidados para morar melhor.",
    intro: "Entenda aluguel, deposito, historico de credito, contrato, escolha de cidade e erros comuns na moradia.",
    canonical: `${SITE_URL}/categorias/moradia-nos-eua.html`,
    matchCategories: ["Moradia nos EUA", "Morar nos EUA", "Morar fora", "Onde morar nos EUA"],
    matchKeywords: ["alugar", "aluguel", "moradia", "morar", "cidade"]
  },
  {
    slug: "noticias-eua",
    title: "Noticias dos EUA",
    h1: "Noticias dos EUA",
    description: "Atualizacoes relevantes sobre saude, politica, diplomacia, seguranca e fatos que impactam brasileiros.",
    intro: "Noticias e explicacoes sobre fatos dos EUA que podem impactar brasileiros, imigrantes e familias.",
    canonical: `${SITE_URL}/categorias/noticias-eua.html`,
    matchCategories: ["Noticias dos EUA", "Notícias dos EUA", "Relacao Brasil-EUA", "Relação Brasil-EUA"],
    matchKeywords: ["trump", "suprema", "eua-classificam", "pcc", "china", "lula", "portugal", "copa-2026", "noticia"]
  },
  {
    slug: "orlando-disney",
    title: "Orlando e Disney",
    h1: "Orlando e Disney",
    description: "Guias para brasileiros sobre Orlando, Disney, Universal, compras, carro, custos, parques e viagem em familia.",
    intro: "Planeje Disney, Universal, parques, carro, compras, custos e roteiro em Orlando com foco em familias brasileiras.",
    canonical: `${SITE_URL}/categorias/orlando-disney.html`,
    matchCategories: ["Orlando e Disney"],
    matchKeywords: ["disney", "universal", "parques"]
  },
  {
    slug: "orlando-e-viagem",
    title: "Orlando e viagem",
    h1: "Orlando em 2026: viagem, Disney, compras e custos para brasileiros",
    description: "Guia pilar de Orlando para brasileiros: Disney, parques, compras, aluguel de carro, custos, roteiro, saude em viagem e planejamento familiar.",
    intro: "Guias de viagem para Orlando: custos, parques, compras, carro, saude, roteiro e planejamento familiar.",
    canonical: `${SITE_URL}/categorias/orlando-e-viagem.html`,
    matchCategories: ["Orlando e viagem", "Orlando e Disney", "Orlando e compras", "Saude e viagem", "Saúde e viagem", "Saude em viagem", "Saúde em viagem", "Viagem e saude", "Viagem e saúde"],
    matchKeywords: ["orlando", "disney", "viagem", "parques", "universal", "roteiro", "filas"]
  },
  {
    slug: "planejamento",
    title: "Planejamento",
    h1: "Planejamento",
    description: "Cidade, custo, dinheiro inicial, trabalho, clima, estado ideal e decisoes antes de mudar.",
    intro: "Antes de mudar, organize dinheiro, cidade, trabalho, documentos, carro, escola e expectativas reais.",
    canonical: `${SITE_URL}/categorias/planejamento.html`,
    matchCategories: ["Planejamento", "Planejamento financeiro"],
    matchKeywords: ["planejamento", "quanto-dinheiro", "antes-de-mudar", "emigrar", "por-que-brasileiros"]
  },
  {
    slug: "primeiros-passos",
    title: "Primeiros passos",
    h1: "Primeiros passos",
    description: "Documentos, celular, banco, escola, mercado, transporte, erros comuns e primeiros 30 dias nos EUA.",
    intro: "Comece pelos guias praticos para os primeiros dias: documentos, banco, celular, escola, mercado, transporte e erros comuns.",
    canonical: `${SITE_URL}/categorias/primeiros-passos.html`,
    matchCategories: ["Primeiros passos", "Recem-chegados", "Recém-chegados"],
    matchKeywords: ["primeiros", "chega", "chegar", "30-dias", "passos"]
  },
  {
    slug: "saude-nos-eua",
    title: "Saude nos EUA",
    h1: "Saude nos EUA",
    description: "Seguro saude, Marketplace, emergencia, ER, urgent care, viagem, custos medicos e cuidados praticos.",
    intro: "Entenda seguro saude, emergencia, urgent care, ER, custos medicos, viagem e cuidados para familias brasileiras.",
    canonical: `${SITE_URL}/categorias/saude-nos-eua.html`,
    matchCategories: ["Saude nos EUA", "Saúde nos EUA", "OMS e saude", "OMS e saúde", "Saude em cruzeiro", "Saúde em cruzeiro", "Saude e viagem", "Saúde e viagem", "Saude em viagem", "Saúde em viagem"],
    matchKeywords: ["saude", "seguro-saude", "emergencia", "urgent-care", "cruzeiro", "oms", "virus"]
  },
  {
    slug: "trabalho-renda",
    title: "Trabalho e renda",
    h1: "Trabalho e renda",
    description: "Emprego, salario, construcao, cleaning, riscos trabalhistas, autorizacao, renda e planejamento para brasileiros.",
    intro: "Guias sobre trabalho, salario, renda, autorizacao, riscos e preparo profissional para brasileiros nos EUA.",
    canonical: `${SITE_URL}/categorias/trabalho-renda.html`,
    matchCategories: ["Trabalho e renda", "Trabalho nos EUA"],
    matchKeywords: ["trabalho", "trabalhar", "salario", "renda", "emprego", "autorizacao", "carreira"]
  },
  {
    slug: "vida-real-nos-eua",
    title: "Vida real nos EUA",
    h1: "Vida real nos EUA",
    description: "Rotina, seguranca, solidao, adaptacao, expectativas, familia e o que muda depois da chegada aos Estados Unidos.",
    intro: "Conteudos humanos sobre rotina, solidao, seguranca, familia, expectativas e o lado real da vida nos EUA.",
    canonical: `${SITE_URL}/categorias/vida-real-nos-eua.html`,
    matchCategories: ["Vida real nos EUA", "Vida nos EUA", "Seguranca nos EUA", "Segurança nos EUA"],
    matchKeywords: ["vida-real", "solidao", "verdade", "perigoso", "sentimos-falta", "rotina", "morar-nos-eua"]
  },
  {
    slug: "visto-americano",
    title: "Visto americano",
    h1: "Visto americano",
    description: "DS-160, agendamento, entrevista, documentos, prazos, negativa, renovacao e planejamento responsavel para brasileiros.",
    intro: "Guias sobre DS-160, entrevista, agendamento, taxa, documentos, negativa, renovacao e visto para familia.",
    canonical: `${SITE_URL}/categorias/visto-americano.html`,
    matchCategories: ["Visto americano"],
    matchKeywords: ["visto", "ds-160", "agendamento", "entrevista", "f1", "renovar"]
  }
];

function articleMatches(category: SiteCategory, article: SiteArticle) {
  const normalizedCategory = normalize(article.category);
  const categoryMatches = category.matchCategories.map(normalize);
  if (categoryMatches.includes(normalizedCategory)) {
    return true;
  }

  const tags = Array.isArray((article as SiteArticle & { tags?: string[] }).tags)
    ? (article as SiteArticle & { tags?: string[] }).tags ?? []
    : [];
  const haystack = normalize(`${article.slug} ${article.title} ${article.description} ${article.h1} ${article.category} ${tags.join(" ")}`);
  return category.matchKeywords.some((keyword) => haystack.includes(normalize(keyword)));
}

function compareArticles(left: SiteArticle, right: SiteArticle) {
  return (right.dateModified || right.datePublished).localeCompare(left.dateModified || left.datePublished);
}

export function categoryUrl(slug: string) {
  return `/categorias/${slug}.html`;
}

export function getCategoryBySlug(slug: string) {
  return siteCategories.find((category) => category.slug === slug);
}

export function getArticlesForCategory(category: SiteCategory) {
  return allArticles
    .filter((article) => articleMatches(category, article))
    .sort(compareArticles);
}

export function getFeaturedArticles(limit = 24) {
  return [...allArticles].sort(compareArticles).slice(0, limit);
}

export function getCategoryGroups() {
  return siteCategories.map((category) => ({
    category,
    posts: getArticlesForCategory(category)
  }));
}
